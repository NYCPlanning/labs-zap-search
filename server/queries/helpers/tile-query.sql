SELECT centroid_3857, polygons_3857, projectid, dcp_projectname, dcp_publicstatus_simp,lastmilestonedate
FROM normalized_projects p
LEFT JOIN project_geoms c
  ON p.dcp_name = c.projectid
WHERE dcp_name IN (${projectIds^})
