import React from 'react'

import { FormattedMessage, injectIntl } from 'react-intl'

import ImagePicker from 'src/components/ImagePicker'
import {
    HelAutoComplete,
    MultiLanguageField,
    HelTextField,
    HelLabeledCheckboxGroup,
    HelLanguageSelect,
    HelDateTimeField,
    HelSelect,
    HelOffersField,
    HelDatePicker,
    NewEvent
} from 'src/components/HelFormFields'
import RepetitiveEvent from 'src/components/RepetitiveEvent'

import { RaisedButton, FlatButton } from 'material-ui'

import {mapKeywordSetToForm, mapLanguagesSetToForm} from 'src/utils/apiDataMapping.js'
import {connect} from 'react-redux'

import {addEventData} from 'src/actions/editor.js'

import moment from 'moment'

import API from 'src/api.js'

let FormHeader = (props) => (
    <div className="row">
        <legend className="col-sm-12">{ props.children }</legend>
    </div>
)

let SideField = (props) => (
    <div className="side-field col-sm-5 col-sm-push-1">
        { props.children }
    </div>
)

/*
let updateEventHidden = function(eventData) {
    return (
        <div>
            <Input
                type="hidden"
                name="data_source"
                value={eventData.data_source}
            />
            <Input
                type="hidden"
                name="publisher"
                value={eventData.publisher}
            />
            <Input
                type="hidden"
                name="id"
                value={eventData.id}
                />
        </div>
    )
};
 */

class FormFields extends React.Component {

    static contextTypes = {
        intl: React.PropTypes.object,
        dispatch: React.PropTypes.func,
        showNewEvents: React.PropTypes.bool,
        showRepetitiveEvent: React.PropTypes.bool,
        events: React.PropTypes.object
    };

    constructor(props) {
      super(props);
      this.state = {
          showNewEvents: false,
          showRepetitiveEvent: false,
          events: {}
      };
    }

    componentWillReceiveProps() {
        this.forceUpdate()
    }

    shouldComponentUpdate() {
        return true
    }

    addNewEventDialog() {
        let obj = {}
        const key = Object.keys(this.props.editor.values.sub_events).length+1;
        obj[key] = {
            start_time: moment.tz(moment(), 'Europe/Helsinki').utc().toISOString(),
            end_time: moment.tz(moment().add(1, 'hours'), 'Europe/Helsinki').utc().toISOString()
        }
        this.context.dispatch(addEventData(obj, key))
    }

    showRepetitiveEventDialog() {
        this.setState({showRepetitiveEvent: !this.state.showRepetitiveEvent})
    }

    showNewEventDialog() {
        this.setState({showNewEvents: !this.state.showNewEvents})
    }
    generateNewEventFields(events) {
    }
    render() {
        let helMainOptions = mapKeywordSetToForm(this.props.editor.keywordSets, 'helfi:topics')
        let helTargetOptions = mapKeywordSetToForm(this.props.editor.keywordSets, 'helsinki:audiences')
        let helEventLangOptions = mapLanguagesSetToForm(this.props.editor.languages)

        let buttonStyle = {
            height: '64px',
            margin: '10px 5px',
            display: 'block'
        }
        const { values, validationErrors, contentLanguages } = this.props.editor
        const newEvents = this.generateNewEventFields(this.props.editor.values.sub_events);
        return (
            <div>
                <div className="col-sm-12 highlighted-block">
                    <div className="col-xl-4">
                        <label>
                            <FormattedMessage id="event-presented-in-languages"/>
                        </label>
                    </div>
                    <div className="col-xl-8">
                        <div className="spread-evenly">
                            <HelLanguageSelect options={API.eventInfoLanguages()} checked={contentLanguages} />
                        </div>
                    </div>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-description-fields-header"/>
                </FormHeader>

                <div className="row">
                    <div className="col-sm-6">
                        <MultiLanguageField required={true} multiLine={false} label="event-headline" ref="name" name="name" validationErrors={validationErrors["name"]} defaultValue={values["name"]} languages={this.props.editor.contentLanguages} />
                        <MultiLanguageField required={true} multiLine={true} label="event-short-description" ref="short_description" name="short_description" validationErrors={validationErrors["short_description"]} defaultValue={values["short_description"]} languages={this.props.editor.contentLanguages} validations={['shortString']} forceApplyToStore />
                        <MultiLanguageField required={true} multiLine={true} label="event-description" ref="description" name="description" validationErrors={validationErrors["description"]} defaultValue={values["description"]} languages={this.props.editor.contentLanguages} />
                        <MultiLanguageField required={false} multiLine={false} label="event-info-url" ref="info_url" name="info_url" validationErrors={validationErrors["info_url"]} defaultValue={values["info_url"]} languages={this.props.editor.contentLanguages} validations={['isUrl']} forceApplyToStore />
                    </div>
                    <SideField>
                        <label><FormattedMessage id="event-image"/></label>
                        <ImagePicker label="image-preview" name="image" />
                    </SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-datetime-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="row">
                            <div className="col-xs-12 col-md-6">
                                <HelDateTimeField validationErrors={validationErrors['start_time']} defaultValue={values['start_time']} ref="start_time" name="start_time" label="event-starting-datetime" />
                            </div>
                            <div className="col-xs-12 col-md-6">
                                <HelDateTimeField validationErrors={validationErrors['end_time']} defaultValue={values['end_time']} ref="end_time" name="end_time" label="event-ending-datetime" />
                            </div>
                        </div>
                        <RaisedButton
                            style={buttonStyle}
                            primary={true}
                            onClick={ () => this.addNewEventDialog() }
                            label={<span><i className="material-icons">add</i> <FormattedMessage id="event-add-new-occasion" /></span>} />
                        <RaisedButton
                            style={buttonStyle}
                            primary={!this.state.showRepetitiveEvent}
                            onClick={ () => this.showRepetitiveEventDialog() }
                            label={<span><i className="material-icons">autorenew</i> <FormattedMessage id="event-add-recurring" /></span>} />
                        <div className={"new-events " + (this.state.showNewEvents ? 'show' : 'hidden')}>
                            { newEvents }
                        </div>
                        <div className={"repetitive-event " + (this.state.showRepetitiveEvent ? 'show' : 'hidden')}>
                            <RepetitiveEvent/>
                        </div>
                    </div>
                    <SideField>
                        <div className="tip">
                            <p>Kirjoita tapahtuman alkamispäivä ja myös alkamisaika, jos tapahtuma alkaa tiettyyn kellonaikaan.</p>
                            <p>Kirjoita myös päättymispäivä sekä päättymisaika, jos tapahtuma päättyy tiettyyn kellonaikaan.</p>
                        </div>
                    </SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-location-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-sm-6">
                        <HelAutoComplete
                            ref="location" name="location"
                            dataSource={`${appSettings.place_autocomplete_api_base}&input=`}
                            resource="place"
                            required={true}
                            validationErrors={validationErrors['location']} defaultValue={values['location']}
                            placeholder={this.context.intl.formatMessage({ id: "event-location" })}
                        />
                        <MultiLanguageField multiLine={true} label="event-location-additional-info" ref="location_extra_info" name="location_extra_info" validationErrors={validationErrors["location_extra_info"]} defaultValue={values["location_extra_info"]} languages={this.props.editor.contentLanguages} />
                    </div>
                    <SideField>
                        <div className="tip">
                            <p>Aloita kirjoittamaan kenttään tapahtumapaikan nimen alkua ja valitse oikea paikka alle ilmestyvästä listasta.</p>
                            <p>Jos tapahtumapaikka löytyy listasta, osoitetta ja sijaintia ei tarvitse kuvailla tarkemmin. Voit kuitenkin laittaa lisätietoja tapahtuman löytämiseksi, kuten kerrosnumero tai muu tarkempi sijainti.</p>
                            <p>Jos tapahtumapaikkaa ei löydy listasta, valitse tapahtumapaikaksi Helsinki ja kirjoita tarkempi paikka tai osoite lisätietokenttään.</p>
                        </div>
                    </SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-price-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-sm-6">
                        <HelOffersField ref="offers" name="offers" validationErrors={validationErrors["offers"]} defaultValue={values["offers"]} languages={this.props.editor.contentLanguages} />
                    </div>
                    <SideField>
                        <div className="tip">
                            <p>Merkitse jos tapahtuma on maksuton tai lisää tapahtuman hinta tekstimuodossa (esim. 7€/5€).</p>
                            <p>Kerro mahdollisesta ennakkoilmoittautumisesta tai anna lisätietoja esimerkiksi paikkavarauksista.</p>
                            <p>Lisää mahdollinen linkki lipunmyyntiin tai ilmoittautumiseen.</p>
                        </div>
                    </SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-social-media-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-sm-6">
                        <HelTextField validations={['isUrl']} ref="extlink_facebook" name="extlink_facebook" label={<FormattedMessage id="facebook-url"/>} validationErrors={validationErrors['extlink_facebook']} defaultValue={values['extlink_facebook']} forceApplyToStore />
                        <HelTextField validations={['isUrl']} ref="extlink_twitter" name="extlink_twitter" label={<FormattedMessage id="twitter-url"/>} validationErrors={validationErrors['extlink_twitter']} defaultValue={values['extlink_twitter']} forceApplyToStore />
                        <HelTextField validations={['isUrl']} ref="extlink_instagram" name="extlink_instagram" label={<FormattedMessage id="instagram-url"/>} validationErrors={validationErrors['extlink_instagram']} defaultValue={values['extlink_instagram']} forceApplyToStore />
                    </div>
                    <SideField><p className="tip">Lisää linkki tapahtuman tai sen järjestäjän some-sivulle.</p></SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-categorization" />
                </FormHeader>
                <div className="row">
                    <HelSelect selectedValues={values['keywords']} legend={"Tapahtuman asiasanat"} ref="keywords" name="keywords" resource="keyword" dataSource={`${appSettings.api_base}/keyword/?show_all_keywords=1&data_source=yso&filter=`} validationErrors={validationErrors['keywords']} />
                    <SideField><p className="tip">Liitä tapahtumaan vähintään yksi asiasana, joka kuvaa tapahtuman teemaa. Aloita kirjoittamaan asiasanaa ja valitse lisättävä asiasana alle ilmestyvästä listasta.</p></SideField>
                    <HelLabeledCheckboxGroup groupLabel={<FormattedMessage id="hel-main-categories"/>}
                                    selectedValues={values['hel_main']}
                                    ref="hel_main"
                                    name="hel_main"
                                    validationErrors={validationErrors['hel_main']}
                                    itemClassName="col-sm-12"
                                    options={helMainOptions} />
                    <SideField><p className="tip">Valitse vähintään yksi pääkategoria.</p></SideField>
                </div>
                <div className="row">
                    <HelLabeledCheckboxGroup
                        groupLabel={<FormattedMessage id="hel-target-groups"/>}
                        selectedValues={values['audience']}
                        ref="audience"
                        name="audience"
                        validationErrors={validationErrors['audience']}
                        itemClassName="col-sm-12"
                        options={helTargetOptions}
                    />
                    <SideField><p className="tip">Jos tapahtumalla ei ole erityistä kohderyhmää, älä valitse mitään.</p></SideField>
                    <HelLabeledCheckboxGroup
                        groupLabel={<FormattedMessage id="hel-event-languages"/>}
                        selectedValues={values['in_language']}
                        ref="in_language"
                        name="in_language"
                        validationErrors={validationErrors['in_language']}
                        itemClassName="col-sm-6"
                        options={helEventLangOptions}
                    />
                    <SideField><p className="tip">Kielet, joita tapahtumassa käytetään.</p></SideField>
                </div>
            </div>
        )
    }
}

export default FormFields
