-- S09 -- validate inventory data integrity.sql
-- Purpose: Test inventory data integrity and edge cases
-- Test: Insert inventory with negative price (should fail if CHECK constraint exists)
INSERT INTO public.inventory (
        inv_vin,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        classification_id
    )
VALUES (
        'WDBUF56X48B123456',
        'Mercedes',
        'E350',
        2008,
        -5000,
        1
    );
-- Test: Insert inventory with year out of range (should fail if CHECK constraint exists)
INSERT INTO public.inventory (
        inv_vin,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        classification_id
    )
VALUES (
        '1N4AL3AP8JC123456',
        'Nissan',
        'Altima',
        1899,
        9000,
        1
    );
-- Test: Insert inventory with valid edge values (should succeed)
INSERT INTO public.inventory (
        inv_vin,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        classification_id
    )
VALUES (
        '5YJSA1E26HF123456',
        'Tesla',
        'Model S',
        2023,
        0,
        1
    );
-- Cleanup
DELETE FROM public.inventory
WHERE inv_vin IN (
        'WDBUF56X48B123456',
        '1N4AL3AP8JC123456',
        '5YJSA1E26HF123456'
    );