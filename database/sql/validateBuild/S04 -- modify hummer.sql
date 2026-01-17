UPDATE PUBLIC.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';
