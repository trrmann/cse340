-- S01: Insert Tony Stark (should succeed)
DO $$
BEGIN
  INSERT INTO PUBLIC.account (account_firstname, account_lastname, account_email, account_password)
  VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');
  RAISE NOTICE 'PASS: Tony Stark insert succeeded';
END $$;

-- S02: Update Tony Stark to Admin (should succeed)
DO $$
BEGIN
  UPDATE PUBLIC.account
  SET account_type = 'Admin'
  WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';
  RAISE NOTICE 'PASS: Tony Stark update to Admin succeeded';
END $$;

-- S03: Delete Tony Stark (should succeed)
DO $$
BEGIN
  DELETE FROM PUBLIC.account
  WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';
  RAISE NOTICE 'PASS: Tony Stark delete succeeded';
END $$;

-- S04: Update Hummer description (should succeed, may affect 0 rows)
DO $$
DECLARE
  rows_updated INTEGER;
BEGIN
  UPDATE PUBLIC.inventory
  SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
  WHERE inv_model = 'Hummer';
  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  RAISE NOTICE 'INFO: Hummer description update affected % row(s)', rows_updated;
END $$;

-- S05: Select Sport inventory (report row count)
DO $$
DECLARE
  sport_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO sport_count
  FROM PUBLIC.inventory i
  INNER JOIN PUBLIC.classification c ON i.classification_id = c.classification_id
  WHERE c.classification_name = 'Sport';
  RAISE NOTICE 'INFO: Sport inventory row count: %', sport_count;
END $$;

-- S06: Update inventory image paths (should succeed)
DO $$
DECLARE
  rows_updated1 INTEGER;
  rows_updated2 INTEGER;
BEGIN
  UPDATE PUBLIC.inventory
  SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
      inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
  GET DIAGNOSTICS rows_updated1 = ROW_COUNT;
  UPDATE PUBLIC.inventory
  SET inv_image = REPLACE(inv_image, '/vehicles/vehicles/', '/vehicles/'),
      inv_thumbnail = REPLACE(inv_thumbnail, '/vehicles/vehicles/', '/vehicles/');
  GET DIAGNOSTICS rows_updated2 = ROW_COUNT;
  RAISE NOTICE 'INFO: Inventory image path updates: % and % row(s)', rows_updated1, rows_updated2;
END $$;

-- Test: Insert duplicate classification name (should fail)
DO $$
BEGIN
  BEGIN
    INSERT INTO public.classification (classification_name) VALUES ('SUV');
    INSERT INTO public.classification (classification_name) VALUES ('SUV');
    RAISE NOTICE 'FAIL: Duplicate classification_name insert did not fail as expected';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'PASS: Duplicate classification_name insert failed as expected';
  END;
END $$;

-- Test: Insert NULL classification name (should fail)
DO $$
BEGIN
  BEGIN
    INSERT INTO public.classification (classification_name) VALUES (NULL);
    RAISE NOTICE 'FAIL: NULL classification_name insert did not fail as expected';
  EXCEPTION WHEN not_null_violation THEN
    RAISE NOTICE 'PASS: NULL classification_name insert failed as expected';
  END;
END $$;

-- Test: Insert valid classification name (should succeed, using unique name) 
DO $$
BEGIN
  INSERT INTO public.classification (classification_name) VALUES ('TestTruck');
  RAISE NOTICE 'PASS: Valid classification_name insert succeeded';
END $$;


-- S08: Inventory constraint tests

-- Test: Insert duplicate VIN (should fail)
DO $$
BEGIN
  BEGIN
    INSERT INTO public.inventory (inv_vin, inv_make, inv_model, inv_year, inv_price, classification_id)
    VALUES ('1HGCM82633A004352', 'Honda', 'Accord', 2020, 15000, 1);
    INSERT INTO public.inventory (inv_vin, inv_make, inv_model, inv_year, inv_price, classification_id)
    VALUES ('1HGCM82633A004352', 'Honda', 'Accord', 2021, 16000, 1);
    RAISE NOTICE 'FAIL: Duplicate VIN insert did not fail as expected';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'PASS: Duplicate VIN insert failed as expected';
  END;
END $$;

-- Test: Insert NULL into NOT NULL columns (should fail)
DO $$
BEGIN
  BEGIN
    INSERT INTO public.inventory (inv_vin, inv_make, inv_model, inv_year, inv_price, classification_id)
    VALUES (NULL, 'Toyota', 'Camry', 2022, 18000, 1);
    RAISE NOTICE 'FAIL: NULL VIN insert did not fail as expected';
  EXCEPTION WHEN not_null_violation THEN
    RAISE NOTICE 'PASS: NULL VIN insert failed as expected';
  END;
END $$;

-- Test: Insert valid inventory row (should succeed)
DO $$
BEGIN
  INSERT INTO public.inventory (inv_vin, inv_make, inv_model, inv_year, inv_price, classification_id)
  VALUES ('2T1BURHE5JC123456', 'Toyota', 'Corolla', 2022, 18000, 1);
  RAISE NOTICE 'PASS: Valid inventory insert succeeded';
END $$;

-- Test: Insert with invalid FK (should fail)
DO $$
BEGIN
  BEGIN
    INSERT INTO public.inventory (inv_vin, inv_make, inv_model, inv_year, inv_price, classification_id)
    VALUES ('3FAHP0HA6AR123456', 'Ford', 'Fusion', 2019, 12000, 999);
    RAISE NOTICE 'FAIL: Invalid FK insert did not fail as expected';
  EXCEPTION WHEN foreign_key_violation THEN
    RAISE NOTICE 'PASS: Invalid FK insert failed as expected';
  END;
END $$;

-- Test: Insert without specifying inv_price (should use DEFAULT)
DO $$
BEGIN
  INSERT INTO public.inventory (inv_vin, inv_make, inv_model, inv_year, classification_id)
  VALUES ('JH4KA8260MC123456', 'Acura', 'Legend', 1991, 1);
  RAISE NOTICE 'PASS: Insert without inv_price used default as expected';
END $$;

-- S09: Inventory data integrity tests

-- Test: Insert inventory with negative price (should fail)
DO $$
BEGIN
  BEGIN
    INSERT INTO public.inventory (inv_vin, inv_make, inv_model, inv_year, inv_price, classification_id)
    VALUES ('WDBUF56X48B123456', 'Mercedes', 'E350', 2008, -5000, 1);
    RAISE NOTICE 'FAIL: Negative price insert did not fail as expected';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'PASS: Negative price insert failed as expected';
  END;
END $$;

-- Test: Insert inventory with year out of range (should fail)
DO $$
BEGIN
  BEGIN
    INSERT INTO public.inventory (inv_vin, inv_make, inv_model, inv_year, inv_price, classification_id)
    VALUES ('1N4AL3AP8JC123456', 'Nissan', 'Altima', 1899, 9000, 1);
    RAISE NOTICE 'FAIL: Out-of-range year insert did not fail as expected';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'PASS: Out-of-range year insert failed as expected';
  END;
END $$;

-- Test: Insert inventory with valid edge values (should succeed)
DO $$
BEGIN
  INSERT INTO public.inventory (inv_vin, inv_make, inv_model, inv_year, inv_price, classification_id)
  VALUES ('5YJSA1E26HF123456', 'Tesla', 'Model S', 2023, 0, 1);
  RAISE NOTICE 'PASS: Valid edge inventory insert succeeded';
END $$;


-- Cleanup: Remove inventory rows referencing 'SUV' and 'Truck' classifications, then delete those classifications
DELETE FROM public.inventory WHERE classification_id IN (
  (SELECT classification_id FROM public.classification WHERE classification_name = 'SUV'),
  (SELECT classification_id FROM public.classification WHERE classification_name = 'Truck')
);
DELETE FROM public.inventory
WHERE inv_vin IN (
  '1HGCM82633A004352',
  '2T1BURHE5JC123456',
  '3FAHP0HA6AR123456',
  'JH4KA8260MC123456',
  'WDBUF56X48B123456',
  '1N4AL3AP8JC123456',
  '5YJSA1E26HF123456'
);
DELETE FROM public.classification
WHERE classification_name IN ('SUV', 'Truck', 'TestTruck');
