import { EditDataType, /*EditMetaData, Reference,*/ ReferenceDetailsType } from '../../../../frontend/src/backendTypes'

/*
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
    Language / printed_language*/

export const newReferenceBasis: EditDataType<ReferenceDetailsType> = {
  ref_type_id: 1,
  title_primary: 'testititle',
  date_primary: 2024,
  volume: '1',
  issue: '1',
  start_page: 1,
  end_page: 100,
  publisher: 'testipublisher',
  pub_place: 'testicity',
  title_secondary: 'test-title-of-issue',
  date_secondary: null,
  title_series: 'testseriestitle',
  issn_isbn: 'test_issn',
  ref_abstract: 'test_abstract',
  web_url: 'test_url',
  misc_1: null,
  misc_2: null,
  gen_notes: 'testnotes',
  printed_language: 'testikieli',
  exact_date: null,
  used_morph: null,
  used_now: null,
  used_gene: null,
  ref_authors: [],
  /*
    ref_authors: [
        {
            rid: undefined,
            au_num: 1,
            author_surname: 'testiauthor',
            author_initials: 'testi-initials',
            field_id: 2,
            rowState: 'new',
        }
    ]*/
  ref_journal_obj: {
    journal_title: 'testijournal',
    short_title: 'shorttitle',
    alt_title: 'alttitle',
    ISSN: 'issn',
    rowState: 'new',
  },
}