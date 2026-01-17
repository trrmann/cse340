
INSERT INTO PUBLIC.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE PUBLIC.account
SET account_type = 'Admin'/*::account_type*/
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

DELETE FROM PUBLIC.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

UPDATE PUBLIC.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

SELECT
	inv_make,
	inv_model,
    classification_name
FROM
    PUBLIC.inventory
INNER JOIN PUBLIC.classification
    ON PUBLIC.inventory.classification_id = PUBLIC.classification.classification_id
WHERE classification_name = 'Sport';

UPDATE PUBLIC.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
/*the following is only here in case the script get rerun to keep the data in a clean state, otherwise the replace can make the data unwieldy and even reach an error when the string exceeds the maximum size capabile for the field type.  this is only needed if the scema is not being rebuilt from scratch*/
UPDATE PUBLIC.inventory
SET inv_image = REPLACE(inv_image, '/vehicles/vehicles/', '/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail, '/vehicles/vehicles/', '/vehicles/');
