node-superblog
==============

A blog application written with node.js, complete with an admin interface.


Need to complete the following
------------------------------
* Admin: login
* Admin: Author CRUD
* Admin: Post CRUD
* View single post page
* Comments: CRUD
* View all posts by tag page
* View all posts by authors page

Developer Notes
---------------
* All salts should be stored alongside the hash in the admin table
* All salts should be generated using a CSPRNG
* All salts should be unique per password
* A new random salt must be generated each time a user creates an account or changes their password.
* A salt should be long, i.e. longer than the actual hash output at the end...

To Store a Password
-------------------
* Generate a long random salt using a CSPRNG.
* Prepend the salt to the password and hash it with a standard cryptographic hash function such as SHA256.
* Save both the salt and the hash in the user's database record.


To Validate a Password
----------------------
* Retrieve the user's salt and hash from the database.
* Prepend the salt to the given password and hash it using the same hash function.
* Compare the hash of the given password with the hash from the database. If they match, the password is correct. Otherwise, the password is incorrect.