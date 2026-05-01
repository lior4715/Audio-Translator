interface PlaybackControlsProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    onRestart: () => void;
    onSkipForwards: () => void;
    onSkipBackwards: () => void;
}
export default function PlaybackControls({isPlaying, onPlayPause, onRestart, onSkipForwards, onSkipBackwards}: PlaybackControlsProps) {

    
    return (<div>
        <button onClick={onPlayPause}>
            {isPlaying ? "Pause" : "Play"}
        </button>

        <button onClick={onRestart}>
            Restart
        </button>

        <button onClick={onSkipForwards}>
            Skip Forwards
        </button>

        <button onClick={onSkipBackwards}>
            Skip Backwards
        </button>
    </div>)
}