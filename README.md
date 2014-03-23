slack-ltc
=========

Lunch Time Coordinator for Slack

A [Slack](https://slack.com) integration that provides meal coordination functions to a channel.  Users announce they are interested in a meal along with specifics such as when, where, willingness to drive, etc.  The LTC will gather and coordinate meals with like users based on when and where they would like to go.  It will then announce the new plans, attempting to meet the most requirements possible.

Installation
============

1. Install [Hammock](https://github.com/tinyspeck/hammock)
2. Clone slack-ltc into the **/plugins** folder
3. ????
4. Profit

Usage
=====

To interact with your LTC, issue any of the following commands:

* **/ltc in**: Tells the LTC that you are in for a meal
* **/ltc at [<|>]12:00pm**: Tells the LTC when you would like to leave
  * *<*: Specifies you want to be back by that time
  * *>*: Specified you want to leave after that time
  * Can be combined to say when you want to leave and when you need to be back
* **/ltc to place1[, place 2, ...]**: Tells the LTC where you would like to go
  * You can specify more than one place, LTC will assume you list your preference in descending order
* **/ltc taking X [no ride]**: Tells the LTC that you are willing to drive and can take an additional X people
  * *no ride* Tells the LTC you *must* drive and cannot be a passenger

Combining Commands
------------------

You can combine multiple commands into a single entry:
> /ltc in at >11:45am <1:00pm to Chipotle's, Moe's, Taco Bell taking 3

Finalizing Plans
================

Once the LTC has enough information it will attempt to create a lunch plan.  Once a lunch plan is created, it will announce the plan 30 minutes before departure along with a last call message:

> @LTC: Behold the following lunch plans:

> @LTC: @shaun will be leaving for Chipotle's after 11:45am with @trevor, @drew, and @ray returning before 1:00pm

> @LTC: @ben will be leaving for Chipotle's after 11:45am with @brian and room for 1 more returning before 1:00pm

> @LTC: @chuck will be leaving for Spera's after 12:00pm with @dean and room for 2 more with no definite return time

> @LTC: Last Call! Please update your meal plans before departure!

Users can change their plans at any time and the LTC will recaluclate and announce any changes

Handling Conflicts
==================

If there is no clear decision, tie breakers are handled in the following fashion:

* In the event of a tie for location, preference will be given to the person providing transportation
* In the event no one specifies a location, the LTC will look in that rooms history and choose a frequently suggested location
* In the event that everyone specifies *no ride*, the LTC will suggest a good local therapist
