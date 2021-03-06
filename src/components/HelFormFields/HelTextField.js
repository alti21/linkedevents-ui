import PropTypes from 'prop-types';
import React from 'react'

import {setData} from 'src/actions/editor.js'
import {TextField} from '@material-ui/core'
import validationRules from 'src/validation/validationRules';
import ValidationPopover from 'src/components/ValidationPopover'
import constants from '../../constants'

const {VALIDATION_RULES, CHARACTER_LIMIT} = constants

class HelTextField extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            error: null,
            value: this.props.defaultValue || '',
        }
    }

    static contextTypes = {
        intl: PropTypes.object,
        dispatch: PropTypes.func,
    }

    componentDidMount() {
        this.setValidationErrorsToState();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(!(_.isEqual(nextProps.defaultValue, this.props.defaultValue))) {
            // Bootstrap or React textarea has a bug where null value gets interpreted
            // as uncontrolled, so no updates are done
            this.setState({value: nextProps.defaultValue ? nextProps.defaultValue : ''})
        }
        this.forceUpdate()
    }

    getStringLengthValidationText() {
        let isShortString = _.find(this.props.validations, i => i === VALIDATION_RULES.SHORT_STRING)
        let isMediumString = _.find(this.props.validations, i => i === VALIDATION_RULES.MEDIUM_STRING)
        let isLongString = _.find(this.props.validations, i => i === VALIDATION_RULES.LONG_STRING)
        
        let limit
        if (!this.state.error && (isShortString || isMediumString || isLongString)) {
            if(isShortString) {
                limit = CHARACTER_LIMIT.SHORT_STRING
            }
            else if(isMediumString) {
                limit = CHARACTER_LIMIT.MEDIUM_STRING
            }
            else if(isLongString) {
                limit = CHARACTER_LIMIT.LONG_STRING
            }
            
            const diff =  limit - this.state.value.length.toString()
            
            if(diff >= 0) {
                return this.context.intl.formatMessage({id: 'validation-stringLengthCounter'}, {counter: diff})
            }
        }
        
        return this.state.error
    }

    getValue() {
        return this.inputRef.value
    }

    helpText() {
        let urlmsg = this.context.intl.formatMessage({id: 'validation-isUrl'})
        let isUrl = _.find(this.props.validations, i => i === VALIDATION_RULES.IS_URL)

        const stringLengthMessage = this.getStringLengthValidationText()
        if(stringLengthMessage) return stringLengthMessage
        else if (isUrl) {
            return this.state.error
                ? urlmsg
                : this.state.error
        }
    }

    handleChange = (event) => {
        const {onChange} = this.props
        const value = event.target.value

        this.setState({value})
        this.setValidationErrorsToState()

        if (typeof onChange === 'function') {
            onChange(event, value)
        }
    }

    handleBlur = (event) => {
        const {name, forceApplyToStore, setDirtyState, onBlur} = this.props
        const value = event.target.value

        // Apply changes to store if no validation errors, or the prop 'forceApplyToStore' is defined
        if (
            name
            && this.getValidationErrors().length === 0
            && !name.includes('time') || name
            && forceApplyToStore
        ) {
            this.context.dispatch(setData({[name]: value}))

            if (setDirtyState) {
                setDirtyState()
            }
        }

        if (typeof onBlur === 'function') {
            onBlur(event, value)
        }
    }

    getValidationErrors() {
        if(this.inputRef && this.inputRef.value && this.props.validations && this.props.validations.length) {
            let validations = this.props.validations.map(item => {
                if(typeof validationRules[item] === 'function') {
                    return {
                        rule: item,
                        passed: validationRules[item](null, this.inputRef.value),
                    }
                } else {
                    return {
                        rule: item,
                        passed: true,
                    }
                }
            })

            validations = validations.filter(i => (i.passed === false))

            if(validations.length) {
                return validations;
            }
        }

        return []
    }
    
    setValidationErrorsToState() {
        let errors = this.getValidationErrors()
        
        if(errors.length > 0) {
            let limit

            switch (errors[0].rule) {
                case VALIDATION_RULES.SHORT_STRING:
                    limit = CHARACTER_LIMIT.SHORT_STRING
                    break;
                case VALIDATION_RULES.MEDIUM_STRING:
                    limit = CHARACTER_LIMIT.MEDIUM_STRING
                    break;
                case VALIDATION_RULES.LONG_STRING:
                    limit = CHARACTER_LIMIT.LONG_STRING
                    break;
            }
            
            return limit ? this.setState({error: this.context.intl.formatMessage({id: `validation-stringLimitReached`}, {limit})}) :
                this.setState({error: this.context.intl.formatMessage({id: `validation-${errors[0].rule}`})})
        }
        else {
            this.setState({error: null})
        }
    }

    noValidationErrors() {
        let errors = this.getValidationErrors()
        return (errors.length === 0)
    }

    render () {
        const {value} = this.state
        const {
            required,
            disabled,
            label,
            placeholder,
            validationErrors,
            index,
            name,
            multiLine,
        } = this.props

        return (
            <React.Fragment>
                <TextField
                    fullWidth
                    name={name}
                    label={label}
                    value={value}
                    required={required}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    multiline={multiLine}
                    inputRef={ref => this.inputRef = ref}
                    helperText={this.helpText()}
                    InputLabelProps={{focused: false, shrink: false, disableAnimation: true}}
                />
                <ValidationPopover
                    index={index}
                    anchor={this.inputRef}
                    validationErrors={validationErrors}
                />
            </React.Fragment>
        )
    }
}

HelTextField.propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    onChange: PropTypes.func,
    validations: PropTypes.array,
    forceApplyToStore: PropTypes.bool,
    setDirtyState: PropTypes.func,
    onBlur: PropTypes.func,
    multiLine: PropTypes.bool,
    required: PropTypes.bool,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    validationErrors: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    index: PropTypes.string,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    maxLength: PropTypes.number,
}

export default HelTextField
