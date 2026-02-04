-- S08 -- validate inventory constraints.sql
-- Purpose: Test inventory table constraints (PK, NOT NULL, UNIQUE, FK, DEFAULT)
-- Test: Insert duplicate VIN (should fail)
INSERT INTO public.inventory (
        inv_vin,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        classification_id
    )
VALUES (
        '1HGCM82633A004352',
        'Honda',
        'Accord',
        2020,
        15000,
        1
    );
INSERT INTO public.inventory (
        inv_vin,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        classification_id
    )
VALUES (
        '1HGCM82633A004352',
        'Honda',
        'Accord',
        2021,
        16000,
        1
    );
-- Test: Insert NULL into NOT NULL columns (should fail)
INSERT INTO public.inventory (
        inv_vin,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        classification_id
    )
VALUES (NULL, 'Toyota', 'Camry', 2022, 18000, 1);
-- Test: Insert valid inventory row (should succeed)
INSERT INTO public.inventory (
        inv_vin,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        classification_id
    )
VALUES (
        '2T1BURHE5JC123456',
        'Toyota',
        'Corolla',
        2022,
        18000,
        1
    );
-- Test: Insert with invalid FK (should fail)
INSERT INTO public.inventory (
        inv_vin,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        classification_id
    )
VALUES (
        '3FAHP0HA6AR123456',
        'Ford',
        'Fusion',
        2019,
        12000,
        999
    );
-- Test: Insert without specifying inv_price (should use DEFAULT)
INSERT INTO public.inventory (
        inv_vin,
        inv_make,
        inv_model,
        inv_year,
        classification_id
    )
VALUES ('JH4KA8260MC123456', 'Acura', 'Legend', 1991, 1);
-- Cleanup
DELETE FROM public.inventory
WHERE inv_vin IN (
        '1HGCM82633A004352',
        '2T1BURHE5JC123456',
        '3FAHP0HA6AR123456',
        'JH4KA8260MC123456'
    );