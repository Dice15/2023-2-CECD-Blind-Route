
const pitch = 1;
const rate = 1;
const delay = 300;  // 300 milliseconds delay


// 함수를 정의하여 시스템에 설치된 음성 목록을 가져오고 정렬
async function populateVoiceList(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
        const synth = window.speechSynthesis;

        // voiceschanged 이벤트가 발생하면 음성 목록을 가져와서 정렬
        synth.onvoiceschanged = () => {
            const voices = synth.getVoices().sort((a, b) => {
                const aname = a.name.toUpperCase();
                const bname = b.name.toUpperCase();
                if (aname < bname) return -1;
                else if (aname === bname) return 0;
                else return +1;
            });

            resolve(voices);  // 정렬된 음성 목록을 반환
        };

        // 만약 음성 목록이 이미 사용 가능하면, 이벤트를 기다리지 않고 목록을 바로 반환
        if (synth.getVoices().length !== 0) {
            synth.onvoiceschanged = null;  // 이벤트 핸들러를 제거
            resolve(synth.getVoices());
        }
    });
}



export async function speak(textToRead: string) {
    const synth = window.speechSynthesis;

    if (synth.speaking) {
        console.error("speechSynthesis.speaking");
        return;
    }

    if (textToRead !== "") {
        const voices = await populateVoiceList();  // 음성 목록을 가져옴
        const utterThis = new SpeechSynthesisUtterance(textToRead);
        utterThis.voice = voices.find(voice => voice.lang === 'ko-KR') || voices[0];  // 한국어 음성을 찾거나, 없으면 첫 번째 음성을 사용
        utterThis.onend = function (event) {
            console.log('Speech has finished being spoken');
        };
        utterThis.onerror = function (event) {
            console.error("SpeechSynthesisUtterance.onerror", event);
        };
        utterThis.pitch = pitch;
        utterThis.rate = rate;

        setTimeout(() => {
            synth.speak(utterThis);
        }, delay);
    }
}
