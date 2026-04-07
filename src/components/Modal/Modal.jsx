import "./Modal.css";

export default function Modal({ isOpen, onClose, title, children, noScroll = false }) {
    if (!isOpen) return null;

    return (<div className="modal-overlay" onClick={onClose}>
        <div className={`modal-box ${noScroll ? 'no-scroll-box' : ''}`} onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
                <h2 className="modal-title">{title}</h2>
                <button className="modal-close" onClick={onClose}>✕</button>
            </div>

            <div className={`modal-body ${noScroll ? 'no-scroll-body' : ''}`}>
                {children}
            </div>

        </div>
    </div>);
}