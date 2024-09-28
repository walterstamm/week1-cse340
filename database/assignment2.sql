-- Insert the following new record to the account table Note: The account_id and account_type fields should handle their own values and do not need to be part of this query.:
-- Tony, Stark, tony@starkent.com, Iam1ronM@n
INSERT INTO public.account(
	 account_firstname, account_lastname, account_email, account_password)
	VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Modify the Tony Stark record to change the account_type to "Admin".
UPDATE public.account SET  account_type='Admin' WHERE account_id=2

--Delete the Tony Stark record from the database.
DELETE FROM public.account WHERE account_id=2;

--Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" using a single query.
UPDATE 
  public.inventory
SET 
  inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior') 
WHERE 
  inv_id=10;

--Use an inner join to select the make and model fields from the inventory table 
--and the classification name field from the classification table for inventory items that belong to the "Sport" category. 
  select i.inv_make,i.inv_model,c.classification_name from public.inventory i
  inner join public.classification c on c.classification_id=i.classification_id
  where c.classification_name='Sport';

  --Update all records in the inventory table to add "/vehicles" to the middle of the file 
  --path in the inv_image and inv_thumbnail columns using a single query.
  
  UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles') ,inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles')

