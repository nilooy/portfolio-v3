---
title: "Generating Unique Usernames with Supabase: A Guide"
summary: "Learn how to generate unique usernames for users upon registration using Supabase with SQL queries and functions."
date: "April 2, 2024"
draft: false
tags:
- Supabase
- SQL
- Web Development
---

In my last project with supabase, i found the need of generating unique username for each user upon registration.

Here's how i did that.



1. I have added the profiles table (you can find the full sql query from here [Query](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs#set-up-the-database-schema))

```sql
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3));
```

2. in the full query from the link above, you can see i also have a trigger which insert record when user signs up

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

3. here's a new function i added to generate unique username. this will generate username from full name initially and if it's not unique we can try generating random ones.

```sql
CREATE OR REPLACE FUNCTION generate_username(full_name text, email text)
RETURNS text
AS $$

DECLARE
  username_new text;
  username_length int := 4; -- you can adjust the starting length
  username_exists boolean;
BEGIN
  -- Generate username based on full name without spaces
  username_new = lower(regexp_replace(full_name, '[^\w]+', '', 'g'));

  -- Try to create a username with 5 characters
  username_new = substr(username_new, 1, username_length);

  -- Check if username already exists in profiles table
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE username = username_new) INTO username_exists;

  -- Increase username length gradually if needed
  WHILE username_exists AND username_length < length(username_new) LOOP
    username_length := username_length + 1;
    username_new = substr(username_new, 1, username_length);
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE username = username_new) INTO username_exists;
  END LOOP;

  -- If username still exists, try with underscore and check again
  IF username_exists THEN
    username_new = lower(regexp_replace(full_name, '[^\w]+', '_', 'g'));
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE username = username_new) INTO username_exists;
  END IF;

  -- If username still exists, try with hyphen and check again
  IF username_exists THEN
    username_new = lower(regexp_replace(full_name, '[^\w]+', '-', 'g'));
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE username = username_new) INTO username_exists;
  END IF;

  -- If username still exists, try with email prefix and check again
  IF username_exists THEN
    username_new = lower(split_part(email, '@', 1)) || '_' || username_new;
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE username = username_new) INTO username_exists;
  END IF;

  -- Increase username length gradually if needed
  WHILE username_exists LOOP
    username_new = username_new || '_' || to_char(trunc(random()*1000000), 'FM000000');
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE username = username_new) INTO username_exists;
  END LOOP;

  RETURN username_new;
END;
$$ language plpgsql security definer;
```


4. Lastly, need to change the trigger function to call `generate_username` function on `username` column to generate unique username on user sign up.

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    public.generate_username(new.raw_user_meta_data->>'full_name', new.email)); -- Generate Username
  return new;
end;
$$ language plpgsql security definer;

```



as example you can try running the query

```sql
select generate_username('rezwan niloy', 'niloy.test@gmail.com')


```
> rezw

That's it!