-- S07 -- validate classification constraints.sql
-- Purpose: Test classification table constraints (PK, NOT NULL, UNIQUE, FK)
-- Test: Insert duplicate classification name (should fail)
INSERT INTO public.classification (classification_name)
VALUES ('SUV');
INSERT INTO public.classification (classification_name)
VALUES ('SUV');
-- Test: Insert NULL classification name (should fail)
INSERT INTO public.classification (classification_name)
VALUES (NULL);
-- Test: Insert valid classification name (should succeed)
INSERT INTO public.classification (classification_name)
VALUES ('Truck');
-- Test: Insert with invalid FK (should fail if FK exists)
-- (Assuming FK to another table, add test if relevant)
-- Cleanup
DELETE FROM public.classification
WHERE classification_name IN ('SUV', 'Truck');