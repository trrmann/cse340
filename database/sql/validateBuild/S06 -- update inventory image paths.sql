UPDATE PUBLIC.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
UPDATE PUBLIC.inventory
SET inv_image = REPLACE(inv_image, '/vehicles/vehicles/', '/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail, '/vehicles/vehicles/', '/vehicles/');
