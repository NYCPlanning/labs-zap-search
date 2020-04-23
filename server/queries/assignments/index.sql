-- first, get the list of assigned projects, roles, and statuses for the specific LUP contact
WITH lups_project_assignments_all AS (
  SELECT DISTINCT
    CONCAT(dcp_lupteammemberrole,'-',dcp_project) AS assignment_id,
    -- assignment_id should be used as a unique id for assignments instead of dcp_projectlupteamid, because we can't trust that dcp_projectlupteamid represents a unique occurance. there can be duplicate instances of a unique user-project-role assignment in the source table.
    dcp_project,
    dcp_lupteammemberrole
  FROM
    dcp_projectlupteam
  WHERE
    dcp_lupteammember = ${id} -- plugs in contactid
    AND statuscode = 'Active' -- only want lup project assignments that haven't been deactivated
),

-- get the public status of the LUP's assigned projects
projects_public_statuses AS (
  SELECT
    dcp_projectid,
    dcp_publicstatus,
    statecode
  FROM
    dcp_project
  WHERE
    dcp_projectid IN (SELECT DISTINCT dcp_project FROM lups_project_assignments_all)
    AND dcp_visibility = 'General Public'
),

-- get the corresponding milestones for the LUP's reviews
lups_review_milestones AS (
  SELECT
    lups_project_assignments_all.*,
    dcp_projectmilestone.*
  FROM
    lups_project_assignments_all,
    dcp_projectmilestone
  WHERE
    dcp_projectmilestone.statuscode <> 'Overridden'
    AND dcp_projectmilestone.dcp_project = lups_project_assignments_all.dcp_project
    AND ( -- this filters down to only keep the milestones that match our user's role
      (dcp_projectmilestone.dcp_milestone = '923beec4-dad0-e711-8116-1458d04e2fb8' AND lups_project_assignments_all.dcp_lupteammemberrole = 'CB')
      OR (dcp_projectmilestone.dcp_milestone = '943beec4-dad0-e711-8116-1458d04e2fb8' AND lups_project_assignments_all.dcp_lupteammemberrole = 'BP')
      OR (dcp_projectmilestone.dcp_milestone = '963beec4-dad0-e711-8116-1458d04e2fb8' AND lups_project_assignments_all.dcp_lupteammemberrole = 'BB')
    )
),

-- get the LUP's dispositions for their assigned projects and roles
lups_dispositions_status AS (
  SELECT
    lups_project_assignments_all.*,
    dcp_communityboarddisposition.statecode AS statecode, -- inactive or active
    dcp_communityboarddisposition.statuscode AS statuscode -- more descriptive status of draft, saved, submitted, deactivated
  FROM
    lups_project_assignments_all,
    dcp_communityboarddisposition
  WHERE
    dcp_communityboarddisposition.statuscode <> 'Deactivated'
    AND dcp_communityboarddisposition.dcp_visibility IN ('General Public', 'LUP')
    AND dcp_communityboarddisposition.dcp_project = lups_project_assignments_all.dcp_project
    AND dcp_communityboarddisposition.dcp_recommendationsubmittedby = ${id} -- plugs in contactid
    AND (
      (dcp_communityboarddisposition.dcp_representing = 'Borough President' AND lups_project_assignments_all.dcp_lupteammemberrole = 'BP')
      OR (dcp_communityboarddisposition.dcp_representing = 'Borough Board' AND lups_project_assignments_all.dcp_lupteammemberrole = 'BB')
      OR (dcp_communityboarddisposition.dcp_representing = 'Community Board' AND lups_project_assignments_all.dcp_lupteammemberrole = 'CB')
    )
  GROUP BY
    dcp_communityboarddisposition.statecode,
    dcp_communityboarddisposition.statuscode,
    lups_project_assignments_all.dcp_project,
    lups_project_assignments_all.dcp_lupteammemberrole,
    lups_project_assignments_all.assignment_id
),

-- join all the tables onto the lups_project_assignments and determine which "tab" each assignment belongs on
lups_project_assignments_with_tab AS (
  SELECT DISTINCT
    CASE
      WHEN
        projects_public_statuses.statecode = 'Inactive'
        THEN 'archive'
      WHEN
        lups_review_milestones.statuscode = 'Not Started'
        THEN 'upcoming'
      WHEN
        lups_review_milestones.statuscode IN ('In Progress', 'Completed')
        AND lups_dispositions_status.statecode IN ('Active', '0')
        AND lups_dispositions_status.statuscode IN ('Draft', 'Saved', '1', '717170000') -- draft status before LUP makes any edits, saved status after they've submitted hearing
        THEN 'to-review'
      WHEN
        lups_review_milestones.statuscode IN ('In Progress', 'Completed')
        AND lups_dispositions_status.statecode IN ('Inactive', '1')
        AND lups_dispositions_status.statuscode IN ('Submitted', 'Not Submitted', '2', '717170002') -- status becomes submitted once they submit recommendation
        THEN 'reviewed'
    END AS tab,
    lups_project_assignments_all.*,
    -- note: the following attributes aren't used in the assignment model; they're only included to help verify that the tab logic is correct
    projects_public_statuses.dcp_publicstatus,
    lups_review_milestones.statuscode AS milestone_statuscode,
    lups_dispositions_status.statecode AS disp_statecode,
    lups_dispositions_status.statuscode AS disp_statuscode
  FROM
    lups_project_assignments_all
  INNER JOIN -- inner because we only want projects that are visible to public
    projects_public_statuses ON lups_project_assignments_all.dcp_project = projects_public_statuses.dcp_projectid
  LEFT JOIN
    lups_dispositions_status ON lups_project_assignments_all.assignment_id = lups_dispositions_status.assignment_id
  LEFT JOIN
    lups_review_milestones ON lups_project_assignments_all.assignment_id = lups_review_milestones.assignment_id
),

-- filter the previous table; we only want to see the BB assignment card for to-review projects and post-cert projects in upcoming
lups_project_assignments_filtered AS (
  SELECT DISTINCT
    assignment_id AS id,
    dcp_lupteammemberrole,
    dcp_project AS project_id,
    tab
  FROM lups_project_assignments_with_tab
  WHERE
    dcp_lupteammemberrole <> 'BB' -- this drops all BB records except for the two conditions below
    OR (dcp_lupteammemberrole = 'BB' AND tab = 'upcoming' AND dcp_publicstatus = 'In Public Review')
    OR (dcp_lupteammemberrole = 'BB' AND tab = 'to-review')
)

-- using the list of projects assigned to that contact, get additional attributes at the project level
SELECT
  lup.*,
  (
    SELECT json_agg(
      json_build_object(
        'role', pa.role,
        'name', pa.name
      )
    )
    FROM (
      ( -- query for primary contact from project
        SELECT
        dcp_applicantadministrator_customer AS id,
        dcp_applicantadministrator_customer$type AS type,
        CASE
          WHEN dcp_applicantadministrator_customer$type = 'contact' THEN contact.fullname
          WHEN dcp_applicantadministrator_customer$type = 'account' THEN account.name
        END AS name,
        'Primary Contact' AS role,
        'Project Record' AS source
        from dcp_project
        LEFT JOIN contact ON contact.contactid = p.dcp_applicantadministrator_customer
        LEFT JOIN account ON account.accountid = p.dcp_applicantadministrator_customer
        WHERE dcp_projectid = p.dcp_projectid
      )
      UNION
      ( -- query for primary applicant from project
        SELECT
        dcp_applicant_customer AS id,
        dcp_applicant_customer$type AS type,
        CASE
          WHEN dcp_applicant_customer$type = 'contact' THEN contact.fullname
          WHEN dcp_applicant_customer$type = 'account' THEN account.name
        END AS name,
        'Primary Applicant' AS role,
        'Project Record' AS source
        from dcp_project
        LEFT JOIN contact ON contact.contactid = p.dcp_applicant_customer
        LEFT JOIN account ON account.accountid = p.dcp_applicant_customer
        WHERE dcp_projectid = p.dcp_projectid
      )
      UNION
      ( -- query for co-applicant from dcp_projectapplicant table
        SELECT
        dcp_projectapplicant.dcp_applicant_customer AS id,
        dcp_projectapplicant.dcp_applicant_customer$type AS type,
        CASE
          WHEN dcp_applicantadministrator_customer$type = 'contact' THEN contact.fullname
          WHEN dcp_applicantadministrator_customer$type = 'account' THEN account.name
        END AS name,
        dcp_projectapplicant.dcp_applicantrole AS role,
        'Project Applicant Record' AS source
        FROM dcp_projectapplicant
        LEFT JOIN dcp_project ON dcp_projectapplicant.dcp_project = p.dcp_projectid
        LEFT JOIN contact ON contact.contactid = dcp_projectapplicant.dcp_applicant_customer
        LEFT JOIN account ON account.accountid = dcp_projectapplicant.dcp_applicant_customer
        WHERE dcp_project.dcp_projectid = p.dcp_projectid
        AND dcp_applicantrole = 'Co-Applicant'
      )
    ) pa
  ) AS project_applicantteam,
  (
    SELECT json_agg(
      json_build_object(
        'id', disp.dcp_communityboarddispositionid,
        'dcp_publichearinglocation', disp.dcp_publichearinglocation,
        'dcp_dateofpublichearing', disp.dcp_dateofpublichearing,
        'dcp_ispublichearingrequired', disp.dcp_ispublichearingrequired,
        'dcp_recommendationsubmittedby', disp.dcp_recommendationsubmittedby,
        'fullname', contact.fullname,
        'dcp_boroughpresidentrecommendation', disp.dcp_boroughpresidentrecommendation,
        'dcp_boroughboardrecommendation', disp.dcp_boroughboardrecommendation,
        'dcp_communityboardrecommendation', disp.dcp_communityboardrecommendation,
        'dcp_consideration', disp.dcp_consideration,
        'dcp_votelocation', disp.dcp_votelocation,
        'dcp_datereceived', disp.dcp_datereceived,
        'dcp_dateofvote', disp.dcp_dateofvote,
        'statecode', disp.statecode,
        'statuscode', disp.statuscode, -- this will be used to determine visibility for the public
        'dcp_docketdescription', disp.dcp_docketdescription,
        'dcp_votinginfavorrecommendation', disp.dcp_votinginfavorrecommendation,
        'dcp_votingagainstrecommendation', disp.dcp_votingagainstrecommendation,
        'dcp_votingabstainingonrecommendation', disp.dcp_votingabstainingonrecommendation,
        'dcp_totalmembersappointedtotheboard', disp.dcp_totalmembersappointedtotheboard,
        'dcp_wasaquorumpresent', disp.dcp_wasaquorumpresent,
        'dcp_projectaction', disp.dcp_projectaction,
        'dcp_name', pact.dcp_name,
        'dcp_ulurpnumber', pact.dcp_ulurpnumber,
        'dcp_representing', disp.dcp_representing,
        'dcp_dateofpublichearing', disp.dcp_dateofpublichearing,
        'dcp_publichearinglocation', disp.dcp_publichearinglocation,
        'dcp_dateofvote', disp.dcp_dateofvote,
        'dcp_votelocation', disp.dcp_votelocation,
        'dcp_votinginfavorrecommendation', disp.dcp_votinginfavorrecommendation,
        'dcp_votingagainstrecommendation', disp.dcp_votingagainstrecommendation,
        'dcp_votingabstainingonrecommendation', disp.dcp_votingabstainingonrecommendation,
        'dcp_totalmembersappointedtotheboard', disp.dcp_totalmembersappointedtotheboard,
        'dcp_wasaquorumpresent', disp.dcp_wasaquorumpresent,
        'dcp_boroughboardrecommendation', disp.dcp_boroughboardrecommendation,
        'dcp_communityboardrecommendation', disp.dcp_communityboardrecommendation,
        'dcp_boroughpresidentrecommendation', disp.dcp_boroughpresidentrecommendation,
        'dcp_consideration', disp.dcp_consideration
      )
    )
    FROM dcp_communityboarddisposition AS disp
    LEFT JOIN dcp_projectaction AS pact ON disp.dcp_projectaction = pact.dcp_action
    LEFT JOIN contact ON dcp_recommendationsubmittedby = contact.contactid
    WHERE
      disp.dcp_project = p.dcp_projectid
      AND disp.dcp_recommendationsubmittedby = ${id} -- plugs in contactid
      AND disp.dcp_visibility IN ('General Public', 'LUP')
      AND disp.statuscode <> 'Deactivated'
      AND (
        (disp.dcp_representing = 'Borough President' AND lup.dcp_lupteammemberrole = 'BP')
        OR (disp.dcp_representing = 'Borough Board' AND lup.dcp_lupteammemberrole = 'BB')
        OR (disp.dcp_representing = 'Community Board' AND lup.dcp_lupteammemberrole = 'CB')
      )
  ) AS dispositions,
  (
    SELECT json_agg(json_build_object(
      'id', m.dcp_projectmilestoneid,
      'dcp_name', m.dcp_name,
      'milestonename', m.milestonename,
      'dcp_plannedstartdate', m.dcp_plannedstartdate,
      'dcp_plannedcompletiondate', m.dcp_plannedcompletiondate,
      'dcp_actualstartdate', m.dcp_actualstartdate,
      'dcp_actualenddate', m.dcp_actualenddate,
      'statuscode', m.statuscode,
      'outcome', m.outcome,
      'dcp_milestone', m.dcp_milestone,
      'dcp_milestonesequence', m.dcp_milestonesequence,
      'dcp_remainingplanneddayscalculated', m.dcp_remainingplanneddayscalculated,
      'dcp_remainingplanneddays', m.dcp_remainingplanneddays,
      'dcp_goalduration', m.dcp_goalduration,
      'dcp_actualdurationasoftoday', m.dcp_actualdurationasoftoday,
      'display_sequence', m.display_sequence,
      'display_name', m.display_name,
      'display_date', m.display_date,
      'display_date_2', m.display_date_2
    ))
    FROM (
      SELECT
        mm.*,
        dcp_milestone.dcp_name AS milestonename,
        dcp_milestoneoutcome.dcp_name AS outcome,
        (CASE
          WHEN mm.dcp_milestone = '780593bb-ecc2-e811-8156-1458d04d0698' THEN 58
          ELSE mm.dcp_milestonesequence
        END) AS display_sequence,
        -- The sequence number is being overidden for this 'CPC Review of Modification Scope' milestone because we want it to be inserted by date between the related city council review milestones
        (CASE
          WHEN mm.dcp_milestone = '963beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Borough Board Review'
          WHEN mm.dcp_milestone = '943beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Borough President Review'
          WHEN mm.dcp_milestone = '763beec4-dad0-e711-8116-1458d04e2fb8' THEN 'CEQR Fee Paid'
          WHEN mm.dcp_milestone = 'a63beec4-dad0-e711-8116-1458d04e2fb8' THEN 'City Council Review'
          WHEN mm.dcp_milestone = '923beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Community Board Review'
          WHEN mm.dcp_milestone = '9e3beec4-dad0-e711-8116-1458d04e2fb8' THEN 'City Planning Commission Review'
          WHEN mm.dcp_milestone = 'a43beec4-dad0-e711-8116-1458d04e2fb8' THEN 'City Planning Commission Vote'
          WHEN mm.dcp_milestone = '863beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Draft Environmental Impact Statement Public Hearing'
          WHEN mm.dcp_milestone = '7c3beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Draft Scope of Work for Environmental Impact Statement Received'
          WHEN mm.dcp_milestone = '7e3beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Environmental Impact Statement Public Scoping Meeting'
          WHEN mm.dcp_milestone = '883beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Final Environmental Impact Statement Submitted'
          WHEN mm.dcp_milestone = '783beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Environmental Assessment Statement Filed'
          WHEN mm.dcp_milestone = 'aa3beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Approval Letter Sent to Responsible Agency'
          WHEN mm.dcp_milestone = '823beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Final Scope of Work for Environmental Impact Statement Issued'
          WHEN mm.dcp_milestone = '663beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Land Use Application Filed'
          WHEN mm.dcp_milestone = '6a3beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Land Use Fee Paid'
          WHEN mm.dcp_milestone = 'a83beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Mayoral Review'
          WHEN mm.dcp_milestone = '843beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Draft Environmental Impact Statement Completed'
          WHEN mm.dcp_milestone = '8e3beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Application Reviewed at City Planning Commission Review Session'
          WHEN mm.dcp_milestone = '780593bb-ecc2-e811-8156-1458d04d0698' THEN 'CPC Review of Council Modification'
          WHEN mm.dcp_milestone = '483beec4-dad0-e711-8116-1458d04e2fb8' THEN 'DEIS Scope of Work Released'
          WHEN mm.dcp_milestone = '4a3beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Scoping Meeting'
        END) AS display_name,
        (CASE
          WHEN mm.dcp_milestone = '963beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
          WHEN mm.dcp_milestone = '943beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
          WHEN mm.dcp_milestone = '763beec4-dad0-e711-8116-1458d04e2fb8' THEN mm.dcp_actualenddate
          WHEN mm.dcp_milestone = 'a63beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
          WHEN mm.dcp_milestone = '923beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
          WHEN mm.dcp_milestone = '9e3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
          WHEN mm.dcp_milestone = 'a43beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualenddate
          WHEN mm.dcp_milestone = '863beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualenddate
          WHEN mm.dcp_milestone = '7c3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
          WHEN mm.dcp_milestone = '7e3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualenddate
          WHEN mm.dcp_milestone = '883beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
          WHEN mm.dcp_milestone = '783beec4-dad0-e711-8116-1458d04e2fb8' THEN mm.dcp_actualstartdate
          WHEN mm.dcp_milestone = 'aa3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualenddate
          WHEN mm.dcp_milestone = '823beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualenddate
          WHEN mm.dcp_milestone = '663beec4-dad0-e711-8116-1458d04e2fb8' THEN mm.dcp_actualenddate
          WHEN mm.dcp_milestone = '6a3beec4-dad0-e711-8116-1458d04e2fb8' THEN mm.dcp_actualenddate
          WHEN mm.dcp_milestone = 'a83beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
          WHEN mm.dcp_milestone = '843beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualenddate
          WHEN mm.dcp_milestone = '8e3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualenddate
          WHEN mm.dcp_milestone = '780593bb-ecc2-e811-8156-1458d04d0698' THEN mm.dcp_actualenddate
          WHEN mm.dcp_milestone = '483beec4-dad0-e711-8116-1458d04e2fb8' THEN mm.dcp_actualenddate
          WHEN mm.dcp_milestone = '4a3beec4-dad0-e711-8116-1458d04e2fb8' THEN mm.dcp_actualenddate
          ELSE NULL
        END) AS display_date,
        -- If the project is not yet in public review, we don't want to display dates for certain milestones
        (CASE
          WHEN mm.dcp_milestone = '963beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN COALESCE(mm.dcp_actualenddate, mm.dcp_plannedcompletiondate)
          WHEN mm.dcp_milestone = '943beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN COALESCE(mm.dcp_actualenddate, mm.dcp_plannedcompletiondate)
          WHEN mm.dcp_milestone = '763beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
          WHEN mm.dcp_milestone = 'a63beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN COALESCE(mm.dcp_actualenddate, mm.dcp_plannedcompletiondate)
          WHEN mm.dcp_milestone = '923beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN COALESCE(mm.dcp_actualenddate, mm.dcp_plannedcompletiondate)
          WHEN mm.dcp_milestone = '9e3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN COALESCE(mm.dcp_actualenddate, mm.dcp_plannedcompletiondate)
          WHEN mm.dcp_milestone = 'a43beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
          WHEN mm.dcp_milestone = '863beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
          WHEN mm.dcp_milestone = '7c3beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
          WHEN mm.dcp_milestone = '7e3beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
          WHEN mm.dcp_milestone = '883beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
          WHEN mm.dcp_milestone = '783beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
          WHEN mm.dcp_milestone = 'aa3beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
          WHEN mm.dcp_milestone = '823beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
          WHEN mm.dcp_milestone = '663beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
          WHEN mm.dcp_milestone = '6a3beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
          WHEN mm.dcp_milestone = 'a83beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN COALESCE(mm.dcp_actualenddate, mm.dcp_plannedcompletiondate)
          WHEN mm.dcp_milestone = '843beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
          WHEN mm.dcp_milestone = '8e3beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
          WHEN mm.dcp_milestone = '780593bb-ecc2-e811-8156-1458d04d0698' THEN NULL
          WHEN mm.dcp_milestone = '483beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
          WHEN mm.dcp_milestone = '4a3beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
          ELSE NULL
        END) AS display_date_2
        -- display_date_2 is only populated for milestones that have date ranges. It captures the end of the date range. If the milestone is in-progress and dcp_actualenddate hasn't been populated yet, we use the planned end date instead.
      FROM dcp_projectmilestone mm
      LEFT JOIN dcp_milestone
        ON mm.dcp_milestone = dcp_milestone.dcp_milestoneid
      LEFT JOIN dcp_milestoneoutcome
        ON mm.dcp_milestoneoutcome = dcp_milestoneoutcomeid
      -- create new column to indicate whether a project has an action that matches "Study" ID --
      -- which is used to optionally include milestones only displayed for projects with Study actions --
      LEFT JOIN (
        SELECT true AS has_study_action,
                dcp_project
        FROM dcp_projectaction
        WHERE dcp_projectaction.dcp_project = p.dcp_projectid
        AND dcp_projectaction.dcp_action = '526ede3a-dad0-e711-8125-1458d04e2f18'
      ) studyaction
      ON mm.dcp_project = studyaction.dcp_project
      WHERE
        mm.dcp_project = p.dcp_projectid
        AND mm.statuscode <> 'Overridden'
        AND (
            dcp_milestone.dcp_milestoneid IN (
              '963beec4-dad0-e711-8116-1458d04e2fb8', --Borough Board Referral--
              '943beec4-dad0-e711-8116-1458d04e2fb8', --Borough President Referral--
              '763beec4-dad0-e711-8116-1458d04e2fb8', --Prepare CEQR Fee Payment--
              'a63beec4-dad0-e711-8116-1458d04e2fb8', --City Council Review--
              '923beec4-dad0-e711-8116-1458d04e2fb8', --Community Board Referral--
              '9e3beec4-dad0-e711-8116-1458d04e2fb8', --CPC Public Meeting - Public Hearing--
              'a43beec4-dad0-e711-8116-1458d04e2fb8', --CPC Public Meeting - Vote--
              '863beec4-dad0-e711-8116-1458d04e2fb8', --DEIS Public Hearing Held--
              '7c3beec4-dad0-e711-8116-1458d04e2fb8', --Review Filed EAS and EIS Draft Scope of Work--
              '7e3beec4-dad0-e711-8116-1458d04e2fb8', --DEIS Public Scoping Meeting--
              '883beec4-dad0-e711-8116-1458d04e2fb8', --Prepare and Review FEIS--
              '783beec4-dad0-e711-8116-1458d04e2fb8', --Review Filed EAS--
              'aa3beec4-dad0-e711-8116-1458d04e2fb8', --Final Letter Sent--
              '823beec4-dad0-e711-8116-1458d04e2fb8', --Issue Final Scope of Work--
              '663beec4-dad0-e711-8116-1458d04e2fb8', --Prepare Filed Land Use Application--
              '6a3beec4-dad0-e711-8116-1458d04e2fb8', --Prepare Filed Land Use Fee Payment--
              'a83beec4-dad0-e711-8116-1458d04e2fb8', --Mayoral Veto--
              '843beec4-dad0-e711-8116-1458d04e2fb8', --DEIS Notice of Completion Issued--
              '8e3beec4-dad0-e711-8116-1458d04e2fb8', --Review Session - Certified / Referred--
              '780593bb-ecc2-e811-8156-1458d04d0698' --CPC Review of Modification Scope--
            )
            OR (
              studyaction.has_study_action -- project has Study action --
              AND dcp_milestone.dcp_milestoneid IN ( -- milestone is a study action milestone --
                '483beec4-dad0-e711-8116-1458d04e2fb8', --DEIS Scope of Work Released--
                '4a3beec4-dad0-e711-8116-1458d04e2fb8' --Scoping Hearing--
              )
            )
          )
      ORDER BY
        display_sequence,
        display_date
    ) AS m
  ) AS milestones,
  (
    SELECT row_to_json(project_row) FROM (
      SELECT
        dcp_name,
        dcp_projectid,
        dcp_projectname,
        dcp_projectbrief,
        dcp_borough,
        dcp_communitydistricts,
        dcp_ulurp_nonulurp,
        dcp_leaddivision,
        dcp_ceqrtype,
        dcp_ceqrnumber,
        dcp_easeis,
        dcp_leadagencyforenvreview,
        dcp_alterationmapnumber,
        dcp_sischoolseat,
        dcp_sisubdivision,
        dcp_previousactiononsite,
        dcp_wrpnumber,
        dcp_nydospermitnumber,
        dcp_bsanumber,
        dcp_lpcnumber,
        dcp_decpermitnumber,
        dcp_femafloodzonea,
        dcp_femafloodzonecoastala,
        dcp_femafloodzonecoastala,
        dcp_femafloodzonev,
        dcp_projectcompleted,
        dcp_publicstatus,
        CASE
          WHEN dcp_publicstatus = 'Prefiled' THEN 'Prefiled'
          WHEN dcp_publicstatus = 'Filed' THEN 'Filed'
          WHEN dcp_publicstatus = 'In Public Review' THEN 'In Public Review'
          WHEN dcp_publicstatus = 'Completed' THEN 'Completed'
          ELSE 'Unknown'
        END AS dcp_publicstatus_simp,
        (
          SELECT json_agg(b.dcp_bblnumber)
          FROM dcp_projectbbl b
          WHERE b.dcp_project = sub_project.dcp_projectid
          AND b.dcp_bblnumber IS NOT NULL AND statuscode = 'Active'
        ) AS bbls,
        (
          SELECT ST_ASGeoJSON(b.polygons, 6)
          FROM project_geoms b
          WHERE b.projectid = sub_project.dcp_name
        ) AS bbl_multipolygon,
        (
          SELECT json_agg(dcp_keyword.dcp_keyword)
          FROM dcp_projectkeywords k
          LEFT JOIN dcp_keyword ON k.dcp_keyword = dcp_keyword.dcp_keywordid
          WHERE k.dcp_project = sub_project.dcp_projectid AND k.statuscode ='Active'
        ) AS keywords,
        (
          SELECT json_agg(
            json_build_object(
              'role', pa.role,
              'name', pa.name
            )
          )
          FROM (
            ( -- query for primary contact from project
              SELECT
              dcp_applicantadministrator_customer AS id,
              dcp_applicantadministrator_customer$type AS type,
              CASE
                WHEN dcp_applicantadministrator_customer$type = 'contact' THEN contact.fullname
                WHEN dcp_applicantadministrator_customer$type = 'account' THEN account.name
              END AS name,
              'Primary Contact' AS role,
              'Project Record' AS source
              from dcp_project
              LEFT JOIN contact ON contact.contactid = p.dcp_applicantadministrator_customer
              LEFT JOIN account ON account.accountid = p.dcp_applicantadministrator_customer
              WHERE dcp_name = p.dcp_name
            )
            UNION
            ( -- query for primary applicant from project
              SELECT
              dcp_applicant_customer AS id,
              dcp_applicant_customer$type AS type,
              CASE
                WHEN dcp_applicant_customer$type = 'contact' THEN contact.fullname
                WHEN dcp_applicant_customer$type = 'account' THEN account.name
              END AS name,
              'Primary Applicant' AS role,
              'Project Record' AS source
              from dcp_project
              LEFT JOIN contact ON contact.contactid = p.dcp_applicant_customer
              LEFT JOIN account ON account.accountid = p.dcp_applicant_customer
              WHERE dcp_name = p.dcp_name
            )
            UNION
            ( -- query for co-applicant from dcp_projectapplicant table
              SELECT
              dcp_projectapplicant.dcp_applicant_customer AS id,
              dcp_projectapplicant.dcp_applicant_customer$type AS type,
              CASE
                WHEN dcp_applicantadministrator_customer$type = 'contact' THEN contact.fullname
                WHEN dcp_applicantadministrator_customer$type = 'account' THEN account.name
              END AS name,
              dcp_projectapplicant.dcp_applicantrole AS role,
              'Project Applicant Record' AS source
              FROM dcp_projectapplicant
              LEFT JOIN dcp_project ON dcp_projectapplicant.dcp_project = p.dcp_projectid
              LEFT JOIN contact ON contact.contactid = dcp_projectapplicant.dcp_applicant_customer
              LEFT JOIN account ON account.accountid = dcp_projectapplicant.dcp_applicant_customer
              WHERE dcp_project.dcp_name = p.dcp_name
              AND dcp_applicantrole = 'Co-Applicant'
            )
          ) pa
        ) AS applicantteam,
        (
          SELECT json_agg(json_build_object(
            'dcp_validatedaddressnumber', a.dcp_validatedaddressnumber,
            'dcp_validatedstreet', a.dcp_validatedstreet
          ))
          FROM dcp_projectaddress a
          WHERE a.dcp_project = sub_project.dcp_projectid
            AND (dcp_validatedaddressnumber IS NOT NULL AND dcp_validatedstreet IS NOT NULL AND statuscode = 'Active')
        ) AS addresses,
        (
          SELECT json_agg(json_build_object(
            'id', a.dcp_projectactionid,
            'dcp_name', SUBSTRING(a.dcp_name FROM '-{1}\s*(.*)'), -- use regex to pull out action name -{1}(.*)
            'actioncode', SUBSTRING(a.dcp_name FROM '^(\w+)'),
            'dcp_ulurpnumber', a.dcp_ulurpnumber,
            'dcp_prefix', a.dcp_prefix,
            'statuscode', a.statuscode,
            'dcp_ccresolutionnumber', a.dcp_ccresolutionnumber,
            'dcp_zoningresolution', z.dcp_zoningresolution
          ))
          FROM dcp_projectaction a
          LEFT JOIN dcp_zoningresolution z ON a.dcp_zoningresolution = z.dcp_zoningresolutionid
          WHERE a.dcp_project = p.dcp_projectid
            AND a.statuscode <> 'Mistake'
            AND SUBSTRING(a.dcp_name FROM '^(\w+)') IN (
              'BD',
              'BF',
              'CM',
              'CP',
              'DL',
              'DM',
              'EB',
              'EC',
              'EE',
              'EF',
              'EM',
              'EN',
              'EU',
              'GF',
              'HA',
              'HC',
              'HD',
              'HF',
              'HG',
              'HI',
              'HK',
              'HL',
              'HM',
              'HN',
              'HO',
              'HP',
              'HR',
              'HS',
              'HU',
              'HZ',
              'LD',
              'MA',
              'MC',
              'MD',
              'ME',
              'MF',
              'ML',
              'MM',
              'MP',
              'MY',
              'NP',
              'PA',
              'PC',
              'PD',
              'PE',
              'PI',
              'PL',
              'PM',
              'PN',
              'PO',
              'PP',
              'PQ',
              'PR',
              'PS',
              'PX',
              'RA',
              'RC',
              'RS',
              'SC',
              'TC',
              'TL',
              'UC',
              'VT',
              'ZA',
              'ZC',
              'ZD',
              'ZJ',
              'ZL',
              'ZM',
              'ZP',
              'ZR',
              'ZS',
              'ZX',
              'ZZ'
            )
        ) AS actions,
        (
          SELECT json_agg(json_build_object(
            'id', m.dcp_projectmilestoneid,
            'dcp_name', m.dcp_name,
            'milestonename', m.milestonename,
            'dcp_plannedstartdate', m.dcp_plannedstartdate,
            'dcp_plannedcompletiondate', m.dcp_plannedcompletiondate,
            'dcp_actualstartdate', m.dcp_actualstartdate,
            'dcp_actualenddate', m.dcp_actualenddate,
            'statuscode', m.statuscode,
            'outcome', m.outcome,
            'dcp_milestone', m.dcp_milestone,
            'dcp_milestonesequence', m.dcp_milestonesequence,
            'dcp_remainingplanneddayscalculated', m.dcp_remainingplanneddayscalculated,
            'dcp_remainingplanneddays', m.dcp_remainingplanneddays,
            'dcp_goalduration', m.dcp_goalduration,
            'dcp_actualdurationasoftoday', m.dcp_actualdurationasoftoday,
            'display_sequence', m.display_sequence,
            'display_name', m.display_name,
            'display_date', m.display_date,
            'display_date_2', m.display_date_2,
            'display_description', m.display_description
          ))
          FROM (
            SELECT
              mm.*,
              dcp_milestone.dcp_name AS milestonename,
              dcp_milestoneoutcome.dcp_name AS outcome,
              (CASE
                WHEN mm.dcp_milestone = '780593bb-ecc2-e811-8156-1458d04d0698' THEN 58
                ELSE mm.dcp_milestonesequence
              END) AS display_sequence,
              -- The sequence number is being overidden for this 'CPC Review of Modification Scope' milestone because we want it to be inserted by date between the related city council review milestones
              (CASE
                WHEN mm.dcp_milestone = '963beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Borough Board Review'
                WHEN mm.dcp_milestone = '943beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Borough President Review'
                WHEN mm.dcp_milestone = '763beec4-dad0-e711-8116-1458d04e2fb8' THEN 'CEQR Fee Paid'
                WHEN mm.dcp_milestone = 'a63beec4-dad0-e711-8116-1458d04e2fb8' THEN 'City Council Review'
                WHEN mm.dcp_milestone = '923beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Community Board Review'
                WHEN mm.dcp_milestone = '9e3beec4-dad0-e711-8116-1458d04e2fb8' THEN 'City Planning Commission Review'
                WHEN mm.dcp_milestone = 'a43beec4-dad0-e711-8116-1458d04e2fb8' THEN 'City Planning Commission Vote'
                WHEN mm.dcp_milestone = '863beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Draft Environmental Impact Statement Public Hearing'
                WHEN mm.dcp_milestone = '7c3beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Draft Scope of Work for Environmental Impact Statement Received'
                WHEN mm.dcp_milestone = '7e3beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Environmental Impact Statement Public Scoping Meeting'
                WHEN mm.dcp_milestone = '883beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Final Environmental Impact Statement Submitted'
                WHEN mm.dcp_milestone = '783beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Environmental Assessment Statement Filed'
                WHEN mm.dcp_milestone = 'aa3beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Approval Letter Sent to Responsible Agency'
                WHEN mm.dcp_milestone = '823beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Final Scope of Work for Environmental Impact Statement Issued'
                WHEN mm.dcp_milestone = '663beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Land Use Application Filed'
                WHEN mm.dcp_milestone = '6a3beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Land Use Fee Paid'
                WHEN mm.dcp_milestone = 'a83beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Mayoral Review'
                WHEN mm.dcp_milestone = '843beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Draft Environmental Impact Statement Completed'
                WHEN mm.dcp_milestone = '8e3beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Application Reviewed at City Planning Commission Review Session'
                WHEN mm.dcp_milestone = '780593bb-ecc2-e811-8156-1458d04d0698' THEN 'CPC Review of Council Modification'
                WHEN mm.dcp_milestone = '483beec4-dad0-e711-8116-1458d04e2fb8' THEN 'DEIS Scope of Work Released'
                WHEN mm.dcp_milestone = '4a3beec4-dad0-e711-8116-1458d04e2fb8' THEN 'Scoping Meeting'
              END) AS display_name,
              (CASE
                WHEN mm.dcp_milestone = '963beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
                WHEN mm.dcp_milestone = '943beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
                WHEN mm.dcp_milestone = '763beec4-dad0-e711-8116-1458d04e2fb8' THEN mm.dcp_actualenddate
                WHEN mm.dcp_milestone = 'a63beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
                WHEN mm.dcp_milestone = '923beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
                WHEN mm.dcp_milestone = '9e3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
                WHEN mm.dcp_milestone = 'a43beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualenddate
                WHEN mm.dcp_milestone = '863beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualenddate
                WHEN mm.dcp_milestone = '7c3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
                WHEN mm.dcp_milestone = '7e3beec4-dad0-e711-8116-1458d04e2fb8' THEN mm.dcp_actualenddate
                WHEN mm.dcp_milestone = '883beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
                WHEN mm.dcp_milestone = '783beec4-dad0-e711-8116-1458d04e2fb8' THEN mm.dcp_actualstartdate
                WHEN mm.dcp_milestone = 'aa3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualenddate
                WHEN mm.dcp_milestone = '823beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualenddate
                WHEN mm.dcp_milestone = '663beec4-dad0-e711-8116-1458d04e2fb8' THEN mm.dcp_actualenddate
                WHEN mm.dcp_milestone = '6a3beec4-dad0-e711-8116-1458d04e2fb8' THEN mm.dcp_actualenddate
                WHEN mm.dcp_milestone = 'a83beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualstartdate
                WHEN mm.dcp_milestone = '843beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualenddate
                WHEN mm.dcp_milestone = '8e3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN mm.dcp_actualenddate
                WHEN mm.dcp_milestone = '780593bb-ecc2-e811-8156-1458d04d0698' THEN mm.dcp_actualenddate
                WHEN mm.dcp_milestone = '483beec4-dad0-e711-8116-1458d04e2fb8' THEN mm.dcp_actualenddate
                WHEN mm.dcp_milestone = '4a3beec4-dad0-e711-8116-1458d04e2fb8' THEN mm.dcp_actualenddate
                ELSE NULL
              END) AS display_date,
              -- If the project is not yet in public review, we don't want to display dates for certain milestones
              (CASE
                WHEN mm.dcp_milestone = '963beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN COALESCE(mm.dcp_actualenddate, mm.dcp_plannedcompletiondate)
                WHEN mm.dcp_milestone = '943beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN COALESCE(mm.dcp_actualenddate, mm.dcp_plannedcompletiondate)
                WHEN mm.dcp_milestone = '763beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
                WHEN mm.dcp_milestone = 'a63beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN COALESCE(mm.dcp_actualenddate, mm.dcp_plannedcompletiondate)
                WHEN mm.dcp_milestone = '923beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN COALESCE(mm.dcp_actualenddate, mm.dcp_plannedcompletiondate)
                WHEN mm.dcp_milestone = '9e3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN COALESCE(mm.dcp_actualenddate, mm.dcp_plannedcompletiondate)
                WHEN mm.dcp_milestone = 'a43beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
                WHEN mm.dcp_milestone = '863beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
                WHEN mm.dcp_milestone = '7c3beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
                WHEN mm.dcp_milestone = '7e3beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
                WHEN mm.dcp_milestone = '883beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
                WHEN mm.dcp_milestone = '783beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
                WHEN mm.dcp_milestone = 'aa3beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
                WHEN mm.dcp_milestone = '823beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
                WHEN mm.dcp_milestone = '663beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
                WHEN mm.dcp_milestone = '6a3beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
                WHEN mm.dcp_milestone = 'a83beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_publicstatus <> 'Filed' THEN COALESCE(mm.dcp_actualenddate, mm.dcp_plannedcompletiondate)
                WHEN mm.dcp_milestone = '843beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
                WHEN mm.dcp_milestone = '8e3beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
                WHEN mm.dcp_milestone = '780593bb-ecc2-e811-8156-1458d04d0698' THEN NULL
                WHEN mm.dcp_milestone = '483beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
                WHEN mm.dcp_milestone = '4a3beec4-dad0-e711-8116-1458d04e2fb8' THEN NULL
                ELSE NULL
              END) AS display_date_2,
              -- display_date_2 is only populated for milestones that have date ranges. It captures the end of the date range. If the milestone is in-progress and dcp_actualenddate hasn't been populated yet, we use the planned end date instead.
              (CASE
                WHEN mm.dcp_milestone = '963beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_ulurp_nonulurp = 'ULURP' THEN 'The Borough Board has 30 days concurrent with the Borough President’s review period to review the application and issue a recommendation.'
                WHEN mm.dcp_milestone = '943beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_ulurp_nonulurp = 'ULURP' THEN 'The Borough President has 30 days after the Community Board issues a recommendation to review the application and issue a recommendation.'
                WHEN mm.dcp_milestone = 'a63beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_ulurp_nonulurp = 'ULURP' THEN 'The City Council has 50 days from receiving the City Planning Commission report to call up the application, hold a hearing and vote on the application.'
                WHEN mm.dcp_milestone = 'a63beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_ulurp_nonulurp = 'Non-ULURP' THEN 'The City Council reviews text amendments and a few other non-ULURP items.'
                WHEN mm.dcp_milestone = '923beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_ulurp_nonulurp = 'ULURP' THEN 'The Community Board has 60 days from the time of referral (nine days after certification) to hold a hearing and issue a recommendation.'
                WHEN mm.dcp_milestone = '923beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_ulurp_nonulurp = 'Non-ULURP' THEN 'The City Planning Commission refers to the Community Board for 30, 45 or 60 days.'
                WHEN mm.dcp_milestone = '9e3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_ulurp_nonulurp = 'ULURP' THEN 'The City Planning Commission has 60 days after the Borough President issues a recommendation to hold a hearing and vote on an application.'
                WHEN mm.dcp_milestone = '9e3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_ulurp_nonulurp = 'Non-ULURP' THEN 'The City Planning Commission does not have a clock for non-ULURP items. It may or may not hold a hearing depending on the action.'
                WHEN mm.dcp_milestone = '7c3beec4-dad0-e711-8116-1458d04e2fb8' THEN 'A Draft Scope of Work must be recieved 30 days prior to the Public Scoping Meeting.'
                WHEN mm.dcp_milestone = '883beec4-dad0-e711-8116-1458d04e2fb8' THEN 'A Final Environmental Impact Statement (FEIS) must be completed ten days prior to the City Planning Commission vote.'
                WHEN mm.dcp_milestone = 'aa3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_ulurp_nonulurp = 'Non-ULURP' THEN 'For many non-ULURP actions this is the final action and record of the decision.'
                WHEN mm.dcp_milestone = 'a83beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_ulurp_nonulurp = 'ULURP' THEN 'The Mayor has five days to review the City Councils decision and issue a veto.'
                WHEN mm.dcp_milestone = '843beec4-dad0-e711-8116-1458d04e2fb8' THEN 'A Draft Environmental Impact Statement must be completed prior to the City Planning Commission certifying or referring a project for public review.'
                WHEN mm.dcp_milestone = '8e3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_ulurp_nonulurp = 'ULURP' THEN 'A "Review Session" milestone signifies that the application has been sent to the City Planning Commission (CPC) and is ready for review. The "Review" milestone represents the period of time (up to 60 days) that the CPC reviews the application before their vote.'
                WHEN mm.dcp_milestone = '8e3beec4-dad0-e711-8116-1458d04e2fb8' AND p.dcp_ulurp_nonulurp = 'Non-ULURP' THEN 'A "Review Session" milestone signifies that the application has been sent to the City Planning Commission and is ready for review. The City Planning Commission does not have a clock for non-ULURP items. It may or may not hold a hearing depending on the action.'
              END) AS display_description
              -- For some milestones, preferred the description varies depending on whether it's a ULURP project
            FROM dcp_projectmilestone mm
            LEFT JOIN dcp_milestone
              ON mm.dcp_milestone = dcp_milestone.dcp_milestoneid
            LEFT JOIN dcp_milestoneoutcome
              ON mm.dcp_milestoneoutcome = dcp_milestoneoutcomeid
            -- create new column to indicate whether a project has an action that matches "Study" ID --
            -- which is used to optionally include milestones only displayed for projects with Study actions --
            LEFT JOIN (
              SELECT true AS has_study_action,
                      dcp_project
              FROM dcp_projectaction
              WHERE dcp_projectaction.dcp_project = p.dcp_projectid
              AND dcp_projectaction.dcp_action = '526ede3a-dad0-e711-8125-1458d04e2f18'
            ) studyaction
            ON mm.dcp_project = studyaction.dcp_project
            WHERE
              mm.dcp_project = p.dcp_projectid
              AND mm.statuscode <> 'Overridden'
              AND (
                  dcp_milestone.dcp_milestoneid IN (
                    '963beec4-dad0-e711-8116-1458d04e2fb8', --Borough Board Referral--
                    '943beec4-dad0-e711-8116-1458d04e2fb8', --Borough President Referral--
                    '763beec4-dad0-e711-8116-1458d04e2fb8', --Prepare CEQR Fee Payment--
                    'a63beec4-dad0-e711-8116-1458d04e2fb8', --City Council Review--
                    '923beec4-dad0-e711-8116-1458d04e2fb8', --Community Board Referral--
                    '9e3beec4-dad0-e711-8116-1458d04e2fb8', --CPC Public Meeting - Public Hearing--
                    'a43beec4-dad0-e711-8116-1458d04e2fb8', --CPC Public Meeting - Vote--
                    '863beec4-dad0-e711-8116-1458d04e2fb8', --DEIS Public Hearing Held--
                    '7c3beec4-dad0-e711-8116-1458d04e2fb8', --Review Filed EAS and EIS Draft Scope of Work--
                    '7e3beec4-dad0-e711-8116-1458d04e2fb8', --DEIS Public Scoping Meeting--
                    '883beec4-dad0-e711-8116-1458d04e2fb8', --Prepare and Review FEIS--
                    '783beec4-dad0-e711-8116-1458d04e2fb8', --Review Filed EAS--
                    'aa3beec4-dad0-e711-8116-1458d04e2fb8', --Final Letter Sent--
                    '823beec4-dad0-e711-8116-1458d04e2fb8', --Issue Final Scope of Work--
                    '663beec4-dad0-e711-8116-1458d04e2fb8', --Prepare Filed Land Use Application--
                    '6a3beec4-dad0-e711-8116-1458d04e2fb8', --Prepare Filed Land Use Fee Payment--
                    'a83beec4-dad0-e711-8116-1458d04e2fb8', --Mayoral Veto--
                    '843beec4-dad0-e711-8116-1458d04e2fb8', --DEIS Notice of Completion Issued--
                    '8e3beec4-dad0-e711-8116-1458d04e2fb8', --Review Session - Certified / Referred--
                    '780593bb-ecc2-e811-8156-1458d04d0698' --CPC Review of Modification Scope--
                  )
                  OR (
                    studyaction.has_study_action -- project has Study action --
                    AND dcp_milestone.dcp_milestoneid IN ( -- milestone is a study action milestone --
                      '483beec4-dad0-e711-8116-1458d04e2fb8', --DEIS Scope of Work Released--
                      '4a3beec4-dad0-e711-8116-1458d04e2fb8' --Scoping Hearing--
                    )
                  )
                )
            ORDER BY
              display_sequence,
              display_date
          ) AS m
        ) AS milestones,
        (
          SELECT json_agg(
            json_build_object(
              'dcp_publichearinglocation', disp.dcp_publichearinglocation,
              'dcp_dateofpublichearing', disp.dcp_dateofpublichearing,
              'dcp_boroughpresidentrecommendation', disp.dcp_boroughpresidentrecommendation,
              'dcp_boroughboardrecommendation', disp.dcp_boroughboardrecommendation,
              'dcp_communityboardrecommendation', disp.dcp_communityboardrecommendation,
              'dcp_consideration', disp.dcp_consideration,
              'dcp_votelocation', disp.dcp_votelocation,
              'dcp_datereceived', disp.dcp_datereceived,
              'dcp_dateofvote', disp.dcp_dateofvote,
              'statecode', disp.statecode,
              'statuscode', disp.statuscode,
              'dcp_docketdescription', disp.dcp_docketdescription,
              'dcp_votinginfavorrecommendation', disp.dcp_votinginfavorrecommendation,
              'dcp_votingagainstrecommendation', disp.dcp_votingagainstrecommendation,
              'dcp_votingabstainingonrecommendation', disp.dcp_votingabstainingonrecommendation,
              'dcp_totalmembersappointedtotheboard', disp.dcp_totalmembersappointedtotheboard,
              'dcp_wasaquorumpresent', disp.dcp_wasaquorumpresent,
              'dcp_projectaction', disp.dcp_projectaction,
              'dcp_name', pact.dcp_name,
              'dcp_ulurpnumber', pact.dcp_ulurpnumber,
              'recommendationsubmittedby', disp.dcp_recommendationsubmittedby,
              'fullname', contact.fullname,
              'dcp_representing', disp.dcp_representing,
              'dateofpublichearing', disp.dcp_dateofpublichearing,
              'boroughboardrecommendation', disp.dcp_boroughboardrecommendation,
              'communityboardrecommendation', disp.dcp_communityboardrecommendation,
              'boroughpresidentrecommendation', disp.dcp_boroughpresidentrecommendation,
              'dcp_projectaction', disp.dcp_projectaction,
              'id', disp.dcp_communityboarddispositionid
            )
          )
          FROM dcp_communityboarddisposition AS disp
          LEFT JOIN dcp_projectaction AS pact ON disp.dcp_projectaction = pact.dcp_action
          LEFT JOIN contact ON dcp_recommendationsubmittedby = contact.contactid
          WHERE
            -- note: we want to get all dispositions, but we only want to show the public ones WHERE statuscode IN ('Saved', 'Submitted')
            disp.dcp_project = p.dcp_projectid
            AND disp.dcp_visibility IN ('General Public', 'LUP')
            AND disp.statuscode <> 'Deactivated'
        ) AS dispositions
      FROM dcp_project sub_project
      WHERE dcp_name = p.dcp_name
        AND dcp_visibility = 'General Public'
    ) project_row
  ) as project

FROM lups_project_assignments_filtered AS lup
LEFT JOIN
  dcp_project AS p ON p.dcp_projectid = lup.project_id
WHERE tab = ${status}
