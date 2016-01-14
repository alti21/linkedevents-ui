const constants = {
    RECEIVE_EVENTS: 'RECEIVE_EVENTS',
    RECEIVE_EVENTS_ERROR: 'RECEIVE_EVENTS_ERROR',
    RECEIVE_EVENT_DETAILS: 'RECEIVE_EVENT_DETAILS',

    RECEIVE_USERDATA: 'RECEIVE_USERDATA',
    CLEAR_USERDATA: 'CLEAR_USERDATA',

    EDITOR_RECEIVE_KEYWORDSETS: 'EDITOR_RECEIVE_KEYWORDSETS',
    EDITOR_CLEAR_FLASHMSG: 'EDITOR_CLEAR_FLASHMSG',
    EDITOR_SETDATA: 'EDITOR_SETDATA',
    EDITOR_CLEARDATA: 'EDITOR_CLEARDATA',
    EDITOR_SENDDATA: 'EDITOR_SENDDATA',
    EDITOR_SENDDATA_COMPLETE: 'EDITOR_SENDDATACOMPLETE',
    EDITOR_SENDDATA_ERROR: 'EDITOR_SENDDATA_ERROR',
    EDITOR_SENDDATA_SUCCESS: 'EDITOR_SENDDATA_SUCCESS',

    // Local storage keys
    EDITOR_VALUES: 'EDITOR_VALUES',

    // Event schedule values
    EVENT_STATUS: {
        SCHEDULED: 'EventScheduled',
        CANCELLED: 'EventCancelled',
        POSTPONED: 'EventPostponed',
        RESCHEDULED: 'EventRescheduled'
    }
}

export default constants
