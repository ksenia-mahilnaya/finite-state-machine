class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {

        this.config = config;
        this.state = this.config.initial;
        this.stack = [];
        this.stack.push(this.state);
        this.stackRedo = [];
        this.prevStep = '';

        if (!this.config) {
             throw new Error("Config isn't passed");
        }

    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {

        return this.state;

    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {

        if (!this.config.states.hasOwnProperty(state)) {
            throw new Error("State doesn't exist");
        }

        this.state = state;
        this.stack.push(this.state);
        this.prevStep = 'changeState';

    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var newState = this.config.states[this.state].transitions[event];

        if (!newState) {
            throw new Error("Such event in current state doesn't exist");
        }

        this.state = newState;
        this.stack.push(this.state);
        this.prevStep = 'trigger';
        return this.state;

    }

    /**
     * Resets FSM state to initial.
     */
    reset() {

        this.state = this.config.initial;
        this.stack = [];
        this.stack.push(this.state);
        this.stackRedo = [];
        return this.state;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var arr = [], newArr = [], num = 0;

        for (var key in this.config.states) {
            arr.push(key);
        }

        if (!event) {
            return arr;
        }

        for (var i = 0; i < arr.length ; i++) {
            num = arr[i];
            if (!this.config.states[num].transitions[event]) {
                newArr.push();
            }
        }

        for (var i = 0; i < arr.length ; i++) {
            num = arr[i];
            if (this.config.states[num].transitions[event]) {
                newArr.push(num);
            }
        }
        return newArr;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {

        var length = this.stack.length,
            deleted;
        if (length < 2) {
            return false;
        }
        deleted = this.stack.pop();
        this.stackRedo.push(deleted);
        length--;
        this.state = this.stack[length - 1];
        this.prevStep = 'undo';
        return true;

    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {

        var lengthRedo = this.stackRedo.length,
            length = this.stack.length,
            deleted;
        if ((lengthRedo) && (this.prevStep === 'undo')) {
            deleted = this.stackRedo.pop();

            this.stack.push(deleted);
            length++;
            this.state = this.stack[length - 1];
            return true;
        }

        return false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {

      this.state = this.config.initial;
      this.stack = [];
      this.stackRedo = [];
      this.prevStep = '';

    }
}
module.exports = FSM;

/** @Created by Uladzimir Halushka **/
