    import React from 'react';
    import audio from './assets/audio_file/audio.wav'
    function Audio({ref}){
        return(
            <audio ref={ref}>
                <source src={audio} type='audio/wav'/>
                your browser does not support the audio element
            </audio>
        )
    }

    export default Audio;