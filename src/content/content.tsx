import { DAILY_FOCUSED_DURATION_PREFERENCE_KEY, DISTRACTING_SITES_KEY, FIRST_DAILY_INTERACTION_TIME_KEY } from "../consts";
type UTC = number;
type Hours = number;

function lessThanXHoursPassed(firstDailyInteraction: UTC, dailyFocusedDurationPreference: Hours): boolean {
    console.log('distraction blocker: ' + (firstDailyInteraction + dailyFocusedDurationPreference * 60 * 60 * 1000 - Date.now()) / 1000 / 60 + ' minutes left')
    return firstDailyInteraction + dailyFocusedDurationPreference * 60 * 60 * 1000 > Date.now()
}

function isFirstDailyInteractionFromToday(firstDailyInteraction) {
    // This whole code is crap and won't work everywhere everyday, for a serious use case
    // we will need to use some library because time is hard. This should work for 99.99% of the cases though
    const dateOfPreviousInteraction = new Date(firstDailyInteraction);
    const currentDate = new Date();
    return (currentDate.getDate() === dateOfPreviousInteraction.getDate() &&
        currentDate.getMonth() === dateOfPreviousInteraction.getMonth() && 
        currentDate.getFullYear() === dateOfPreviousInteraction.getFullYear())
}
chrome.storage.sync.get([DISTRACTING_SITES_KEY, FIRST_DAILY_INTERACTION_TIME_KEY, DAILY_FOCUSED_DURATION_PREFERENCE_KEY], (storageObj) => {
    let firstDailyInteraction = storageObj[FIRST_DAILY_INTERACTION_TIME_KEY];
    const dailyFocusedDurationPreference = storageObj[DAILY_FOCUSED_DURATION_PREFERENCE_KEY];
    if (!firstDailyInteraction && dailyFocusedDurationPreference) {
        firstDailyInteraction = Date.now()
        chrome.storage.sync.set({
            [FIRST_DAILY_INTERACTION_TIME_KEY]: firstDailyInteraction
        })
    } else if (!isFirstDailyInteractionFromToday(firstDailyInteraction)) {
        firstDailyInteraction = Date.now()
        chrome.storage.sync.set({
            [FIRST_DAILY_INTERACTION_TIME_KEY]: firstDailyInteraction
        })
    }
    const isDistracting = storageObj[DISTRACTING_SITES_KEY].some(distractingUrl => location.href.includes(distractingUrl))
    if (isDistracting) {
        if (!dailyFocusedDurationPreference || lessThanXHoursPassed(firstDailyInteraction, dailyFocusedDurationPreference)) {
            document.body.innerHTML = 'BAD GIRL NOT HERE GO WORK'
        } 
    }
});