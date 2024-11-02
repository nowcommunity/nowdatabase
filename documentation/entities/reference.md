# References

## References in db

ref_ref-table stores the info of a singular reference. A reference uses several other tables for more complicated data structures:
* ref_ref_type: the type of the reference
    * ref_field_name: fields of the reference type
* ref_authors: authors of a reference. Each author consists of
    * rid: reference it is linked to
    * field_id: the field of the reference it is linked to (references have multiple fields for authors)
    * au_num: denotes the order of the authors in a reference (since usually in scientific papers the first and last author of a paper are more importa)
    * And some fields for the name of the author etc
* ref_journal: the journal of the reference. One journal per reference
    * Presumably its own table so the same journal can be used in multiple references, although that doesn't seem particularly useful at the moment
* Relation tables to connect the main entities to references
    * now_br
    * now_lr
    * now_sr
    * now_tr
    * now_tur
* There is also a table (ref_keywords) for the keywords for the references but I believe it to be unused at the moment

## Reference fields

* In frontend, at the moment a reference can have 23 possible fields. All of the possible fields are shown in references with type 'undefined'. check documentation/reference_types for a list of the existing fields.
* The fields that are shown on a reference type are defined in the database
* Most of the fields are basic text/number fields but authors and journals have their own components, defined in frontend/src/components/reference/tabs/AuthorTab.tsx & JournalTab.tsx
* Author fields are defined in list authorFields in frontend/src/components/reference/tabs/ReferenceTab.tsx
* Number fields are defined in list numberFields in frontend/src/components/reference/tabs/ReferenceTab.tsx

* A large and messy portion of frontend/src/components/reference/tabs/ReferenceTab.tsx is for grouping the fields while splitting authors & journals to their own resizeable fields. Perhaps someone with better understanding of react can find a prettier solution.

### Adding a new field to a reference:

Not possible trough the interface. However if still necessary, here's some things you need to edit
* ref_ref table in schema.prisma, the info of the new field needs to be saved here
* Fields are stored in the ref_field_name table in schema.prisma. However each entry to this db is more of a connection between a field and a reference type
    * You should create a new entry to the table for all of the connections between the new field & the 14 reference types & set the visibility to true or false depending on if you want the new field to be visible to the reference type
    * The field itself is not defined in one specific place and is something more of an emergent entity from all of these connections
    * The new field's field_name needs to match the name of the field in ref_ref where the information will be saved
* Most of the types relating to references need to be edited in forntend/src/backendTypes.ts

* You can accomplish the above in testdata/sqlfiles/now_test.sql by adding some rows. Rows 3200+ add the existing fields so looks for help there

* Similarly, if you'd like to create a new reference type, you should add an en try to ref_ref_type table in schema.sql, and the connect all the existing fields to it in ref_field_name table

## Updating / deleting a reference

Mainly straightforward but there here's some technical solutions and why they were used
* When a reference is edited, all of the authors connected to the reference are deleted and new ones are created instead
    * An author is not its own entity. Instead, the entries to the author table (ref_authors) are a combination of the rid of the reference, the field of the reference where author is stored and the order number of in the reference, which makes editing existing authors unnecessarily complicated
        * An author doesn't have its own id, the id is a compound id based on these fields, so you can't really edit a specific author. You'd be editing the data of a certain reference on a certain field on a certain index
        * Try to imagine moving the last author to the first place while deleting the author that was previously on the 4th place. Trying to update the orders of the authors (which would mean editing their ids) would be redicilous. Instead, we just delete the authors and create new ones where their order is the order they appear in the data, and there is no conflict with existing ids
    * Because the data is first deleted, this is done transactionally. This way if adding new authors fails, the old data is not lost
* When a reference is deleted, all authors connected to the reference are deleted. The authors in the ref_authors table are more of a connection to the reference than actual entities themselves. So leaving the in the table would just leave residual data and lead to conflicting ids
* When a reference is deleted, the journals connected to the reference are not deleted. Since multiple references can use the same journal, deleting them could lead to problems
    * However this means there is no way to delete journals in the interface. Which is not great.


## Possible problems
* References have functionality so you can search existing authors when adding an author to the reference. Because of the way author table is structured, there are some list operations the remove duplicate authors in the data and order them, which may become too slow
* Journals are not deleted when a reference is deleted so it is possible for journals to exist that are not used by references. This may lead to some residual data piling up, and there is no simple way to clean it at the moment.
    * Perhaps an admin button to delete journals wihtout any references in the future?
* Updating a reference deletes authors of the reference an the adds them back. This may be a bit more costly in terms of time but it is way simpler of a solution
    * The code should not delete authors if something fails in the backend while editing the authors. But there is always a slight chance the code does not work as intended.

