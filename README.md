node-superblog
==============

A blog application written with node.js, complete with an admin interface. This is mostly a learning exercise for me, but if it helps you set up an express project then that's good too!

I've tried to use best practice wherever possible (though so far no TDD - which is kinda new to me).  


TODO
----
* Learn and implement tests for TDD, using something like Mocha(?)
* Admin: Login method needs updating - salt needs to be (ap|pre)pended to the hash before it's stored
* Admin: Administrator CRUD
* Admin: Author CRUD
* Admin: Post CRUD
* Admin: Comments CRUD
* Site: View single post page
* Site: View all posts by tag page
* Site: View all posts by authors page
* Site: Retrieve all tags for left navigation on list posts page (utilising async db transactions)

Known Issues
------------
* No validation on administrator create screen
* Unable to share view elements between multiple contexts (i.e. site, admin)
* No seed data for administrator accounts - at the moment you need to do this via mongo in the terminal

...if you're aware of any other issues please raise a ticket =)


Brain Dump
==========

This section is for me as it turns out I'm a bit of a noob and quite out of touch!

Test Driven Development
-----------------------

Inspires simple designs and confidence

Write automated test cases that initially fail:
	- The test should define a new function or enhancement
	- Then, produce the minimum amount of code to pass the test
	- Refactor the code to acceptable standards

Adding a test
-------------
Requirements and specification must be clearly understood before starting (via user stories or use cases)
Each new feature begins with writing a test.
The test must fail because it's written before implementing the feature.
If the test doesn't fail initially, then the feature already exists or the test is defective.
