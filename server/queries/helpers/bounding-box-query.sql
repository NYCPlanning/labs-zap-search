SELECT
ARRAY[
  ARRAY[
    ST_XMin(bbox),
    ST_YMin(bbox)
  ],
  ARRAY[
    ST_XMax(bbox),
    ST_YMax(bbox)
  ]
] as bbox
FROM (
  ---now that we're using column centroid_3857 for our tiles, we need to transform it here to EPSG 4326---
  SELECT ST_Extent(ST_Transform(centroid_3857, 4326)) AS bbox
  FROM (
    ${tileSQL^}
  ) x
) y
