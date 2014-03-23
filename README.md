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
> /ltc in at >11:45am <1:00pm to Chipotle, Moe's, Taco Bell taking 3
