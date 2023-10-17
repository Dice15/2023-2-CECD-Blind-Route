


/**
 * VoiceProvider 클래스는 speechSynthesis API를 사용하여 텍스트를 음성으로 변환하며,
 * 시스템에 설치된 음성 목록을 관리합니다.
 */
export default class VoiceProvider {
    private static voices: SpeechSynthesisVoice[] | null = null;

    private constructor() { }



    /**
     * populateVoiceList 메서드는 시스템에 설치된 음성 목록을 가져와서 정렬합니다.
     * 이 메서드는 voiceschanged 이벤트가 발생하면 호출됩니다.
     * @returns {Promise<SpeechSynthesisVoice[]>} 정렬된 음성 목록을 반환합니다.
     */
    private static async populateVoiceList(): Promise<SpeechSynthesisVoice[]> {
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



    /**
     * getVoices 메서드는 이미 준비된 음성 목록을 반환하거나,
     * 음성 목록이 아직 준비되지 않았다면 populateVoiceList 메서드를 호출하여 준비합니다.
     * @returns {Promise<SpeechSynthesisVoice[]>} 음성 목록을 반환합니다.
     */
    private static async getVoices(): Promise<SpeechSynthesisVoice[]> {
        if (!this.voices) {
            this.voices = await this.populateVoiceList();
        }
        return this.voices;
    }



    /**
     * speak 메서드는 주어진 텍스트를 읽습니다.
     * 만약 현재 음성이 이미 말하고 있다면, 그 음성을 중지하고 새 텍스트를 읽습니다.
     * @param {string} textToRead - 읽을 텍스트입니다.
     */
    public static async speak(textToRead: string) {
        const synth = window.speechSynthesis;

        if (textToRead !== "") {
            const voices = await this.getVoices();  // 음성 목록을 가져옴
            const utterThis = new SpeechSynthesisUtterance(textToRead);
            utterThis.voice = voices.find(voice => voice.lang === 'ko-KR') || voices[0];
            utterThis.pitch = 1;
            utterThis.rate = 1;

            // 현재 말하고 있는 경우, 그것을 중지
            if (synth.speaking) {
                synth.cancel();
            }

            setTimeout(() => {
                synth.speak(utterThis);  // 새 텍스트를 말하도록 명령
            }, 300);
        }
    }
}
