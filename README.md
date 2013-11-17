node-superblog
==============

A blog application written with node.js, complete with an admin interface. This is mostly a learning exercise for me, but if it helps you set up an express project then that's good too!

I've tried to use best practice wherever possible (though so far no TDD - which is kinda new to me).  


TODO
----
* Learn and implement tests for TDD, using something like Mocha(?)
* Admin: Dashboard needs designing; 'widget' type interface needs some thought
* Admin: Administrator CRUD
* Admin: Post CRUD
* Admin: Author CRUD
* Admin: Comments CRUD
* Site: View all posts by tag page
* Site: View all posts by authors page
* Site: Retrieve all tags for left navigation on list posts page (utilising async db transactions)

Known Issues
------------
* Unable to share view elements between multiple contexts (i.e. site, admin)
* No seed data for administrator accounts - at the moment you need to do this via mongo in the terminal

...if you're aware of any other issues please raise a ticket =)