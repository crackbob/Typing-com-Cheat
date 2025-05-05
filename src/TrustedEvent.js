export default function (eventClass, type, options) {
    let event = new eventClass(type, options);
    let spoofedEvent = { isTrusted: true, ...options };
    let eventPrototype = Object.getPrototypeOf(event);

    // auto set these
    Object.getOwnPropertyNames(eventPrototype).forEach(key => {
        spoofedEvent[key] = event[key];
    });

    // manually set these
    spoofedEvent.timeStamp = event.timeStamp;
    spoofedEvent.type = type;
    spoofedEvent.preventDefault = () => {};
    spoofedEvent.stopPropagation = () => {};

    // spoof instanceof
    Object.setPrototypeOf(spoofedEvent, eventPrototype);
    
    return spoofedEvent;
}