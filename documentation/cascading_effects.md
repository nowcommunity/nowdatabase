### Cascading effects of editing time entities

A Locality has a minimum age and a maximum age. The maximum age should be a higher value than the minimum for every Locality.
These ages can be either be an absolute values or a calculated ones. Calculated ones are based on Time Units and their fractions. 
In these cases, the maximum age of a Locality is the maximum value of the (fraction of the) selected Time Unit, and the minimum for the minimum age.
A Locality's maximum age and minumum age may be based on the same Time Unit, different Time Units or one is based on a Time Unit and other is an absolute value.


Time Units are build from two Time Bounds: a lower bound and an upper bound. Here the lower bound should be a higher value than the upper bound.


Time Bounds are point-like objects, although they have error margins.


There are validators for each of these entities to keep them from being contradicting within themselves, but a Time Unit may be used in tens of Localities and a Time Bound may be selected for multiple Time Units. It is crucial that editing any of these doesn't result in a Time Unit with upper bound higher than lower or a Locality with minimum age higher than maximum age. In addition to this, if editing a time entity should go through, all affected entities should be edited and these edits should be logged correctly.

At this moment, this is done for editing Time Units. When sending a PUT-request to the backend, the [route](../backend/src/routes/timeUnit.ts) will first check for user rights, then validate the Time Unit. If either of these fail, the process will not continue. If eligible user is editing with a valid Time Unit, the [write-service](../backend/src/services/write/timeUnit.ts) will create a writehandler for the Time Unit and update it without commiting yet. Then (in case of edit) cascading effects will be checked in [cascade handler](../backend/src/utils/cascadeHandler.ts). All Localities connected to the Time Unit in question are queried and new minimum and maximum ages are calculated for them. If any of these Localities would become contradicting, no changes will be made any tables and the user will be notified, which Localities are creating the problem. If all Localities would be ok, all of them would be updated and logged correctly, after which, the Time Unit edit would be also logged and committed.

Similar logic for Time Bounds is under construction