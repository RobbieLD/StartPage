// This class is a wrapper for the dom event handling so we can use it with out having to attach to an actual dom node
class EventTarget {
    constructor() {
        let target = document.createTextNode(null);
        this.addEventListener = target.addEventListener.bind(target);
        this.removeEventListener = target.removeEventListener.bind(target);
        this.dispatchEvent = target.dispatchEvent.bind(target);
    }
}