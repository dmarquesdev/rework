export default function items(
    state,
    action,
    error,
    RECEIVE = 'action1',
    REMOVE = 'action2',
    UPDATE = 'action3',
    INSERT = 'action4',
    RECEIVE_ONE = 'action5',
    UPDATE_ALL = 'action6') {
    const newState = state;
    const payloadItems = {};
    let newItems = [];

    switch (action.type) {
        case RECEIVE:
            newItems = action.payload.items.items.map(item => Object.assign({ error, 'key': item.id }, item));
            newState.items = Array.from(new Set([...state, ...newItems]));

            return newState;
        case REMOVE:
            newState.items = state.items.filter(item => item.id !== action.payload.id);
            return newState;
        case UPDATE:
            if (newState.page === undefined) {
                return Object.assign(state, action.payload.item);
            }

            newState.items = state.items.map(item => {
                if (item.id === action.payload.item.id) {
                    return action.payload.item;
                }

                return item;
            });

            return newState;
        case INSERT:
            action.payload.items.forEach(item => {
                const newItem = { ...item, error };
                newState.items.push(newItem);
            });
            return newState;
        case RECEIVE_ONE:
            return action.payload.item;
        case UPDATE_ALL:
            action.payload.items.forEach(item => {
                payloadItems[item.id] = item;
            });

            newState.items = state.items.map(item => {
                if (payloadItems[item.id] !== undefined) {
                    return payloadItems[item.id];
                }

                return item;
            });

            return newState;
        default:
            return state;
    }
}
