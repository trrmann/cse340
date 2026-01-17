SELECT
	inv_make,
	inv_model,
    classification_name
FROM
    PUBLIC.inventory
INNER JOIN PUBLIC.classification
    ON PUBLIC.inventory.classification_id = PUBLIC.classification.classification_id
WHERE classification_name = 'Sport';
