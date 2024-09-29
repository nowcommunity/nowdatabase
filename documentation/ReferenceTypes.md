Current reference types & their field labels / field names (29.09.2024)

As of 29.01.2024 there is no UI to add more entries however you can do it by altering the db itself.

In the test_data/sqlfiles/now_test.sql code related to adding reference types is around rows 3665-3700 and the fields for the data types are added around rows 3175-3525.

Do concider other options before you try to alter the data by hand.

"ref_type_id": 1, "ref_type": "Journal"'
    Title / title_primary
    Authors / authors_primary
    Year / date_primary
    Journal / journal_id
    Volume / volume
    Issue / issue
    Start Page / start_page
    End Page / end_page
    Publisher / publisher
    City / pub_place
    Title of Issue / title_secondary
    Editors of Issue / authors_secondary
    Series Title / title_series
    ISSN/ISBN / issn_isbn
    Abstract / ref_abstract
    Web/URL / web_url
    Notes / gen_notes
    Language / printed_language

"ref_type_id": 2, "ref_type": "Book",
    Title / title_primary
    Authors / authors_primary
    Year / date_primary
    Edition / volume
    Volume / issue
    No of Pages / end_page
    Publisher / publisher
    City / pub_place
    Editors / authors_secondary
    Series Title / title_series
    Series Editors / authors_series
    ISBN / issn_isbn
    Abstract / ref_abstract
    Web/URL / web_url
    Notes / gen_notes
    Language / printed_language

"ref_type_id": 3, "ref_type": Book Chapter'
    Title / title_primary
    Authors / authors_primary
    Year / date_primary
    Edition / volume
    Chapter No / issue
    Start Page / start_page
    End Page / end_page
    Publisher / publisher
    City / pub_place
    Book Title / title_secondary
    Editors / authors_secondary
    Series Title / title_series
    Series Editors / authors_series
    ISBN / issn_isbn
    Abstract / ref_abstract
    Web/URL / web_url
    Volume / misc_2
    Notes / gen_notes
    Language / printed_language

"ref_type_id": 4, "ref_type": Thesis/Dissertation'
    Title / title_primary
    Authors / authors_primary
    Year / date_primary
    No of Pages / end_page
    Institution / publisher
    Abstract / ref_abstract
    Web/URL / web_url
    Degree / misc_1
    Notes / gen_notes
    Language / printed_language

"ref_type_id": 5, "ref_type": Conference Proceeding'
    Title / title_primary
    Authors / authors_primary
    Publication Year / date_primary
    Journal / journal_id
    Volume / volume
    Edition / issue
    Start Page / start_page
    End Page / end_page
    Publisher / publisher
    City / pub_place
    Title of Conference / title_secondary
    Editors / authors_secondary
    Year of Conference / date_secondary
    Series Title / title_series
    Series Editors / authors_series
    Abstract / ref_abstract
    Web/URL / web_url
    Notes / gen_notes
    Language / printed_language

"ref_type_id": 6, "ref_type": Electronic Citation'
    Title / title_primary
    Authors / authors_primary
    Last Update (Year) / date_primary
    Organisation / title_secondary
    Editors / authors_secondary
    Abstract / ref_abstract
    Web/URL / web_url
    Last Update (Day Month) / misc_1
    Notes / gen_notes
    Language / printed_language
    Access Date / exact_date

"ref_type_id": 7, "ref_type": Internet Communication'
    Subject / title_primary
    Sender / authors_primary
    Year / date_primary
    Recipient / authors_secondary
    Sender's e-mail / misc_1
    Recipient's e-mail / misc_2
    Notes / gen_notes
    Language / printed_language
    Date of Message / exact_date

"ref_type_id": 8, "ref_type": Report'
    Title / title_primary
    Authors / authors_primary
    Year / date_primary
    Report Number / volume
    Start Page / start_page
    End Page / end_page
    Publisher / publisher
    Pub Place / pub_place
    Report Name / title_secondary
    Editors / authors_secondary
    Series Title / title_series
    Series Editors / authors_series
    Abstract / ref_abstract
    Web/URL / web_url
    Notes / gen_notes
    Language / printed_language

"ref_type_id": 9, "ref_type": Unpublished Work'
    Title / title_primary
    Authors / authors_primary
    Year / date_primary
    Organisation / title_secondary
    Editors / authors_secondary
    Series Title / title_series
    Series Editors / authors_series
    Abstract / ref_abstract
    Web/URL / web_url
    Notes / gen_notes
    Language / printed_language

"ref_type_id": 10, "ref_type": Personal Communication'
    Authors / authors_primary
    Year / date_primary
    Recipients / authors_secondary
    Type / misc_1
    Notes / gen_notes
    Language / printed_language
    Date Sent / exact_date

"ref_type_id": 11, "ref_type": Manuscript'
    Title / title_primary
    Authors / authors_primary
    Date / date_primary
    Organisation / title_secondary
    Editors / authors_secondary
    Series Title / title_series
    Series Editors / authors_series
    Notes / gen_notes
    Language / printed_language
    Date / exact_date

"ref_type_id": 12, "ref_type": Notes'
    Subject / title_primary
    Authors / authors_primary
    Year / date_primary
    Notes / gen_notes
    Date / exact_date

"ref_type_id": 13, "ref_type": Editing'
    Title / title_primary
    Authors / authors_primary
    Year / date_primary
    Notes / gen_notes
    Date / exact_date

"ref_type_id": 14, "ref_type": Undefined'
    title_primary / title_primary
    authors_primary / authors_primary
    date_primary / date_primary
    journal_id / journal_id
    volume / volume
    issue / issue
    start_page / start_page
    end_page / end_page
    publisher / publisher
    pub_place / pub_place
    title_secondary / title_secondary
    authors_secondary / authors_secondary
    date_secondary / date_secondary
    title_series / title_series
    authors_series / authors_series
    issn_isbn / issn_isbn
    abstract / abstract
    web_url / web_url
    misc_1 / misc_1
    misc_2 / misc_2
    gen_notes / gen_notes
    language / language
    exact_date / exact_date