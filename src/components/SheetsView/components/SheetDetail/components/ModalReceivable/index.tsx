import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';

interface ModalProps {
    showModal: boolean;
    hideModal: (value: boolean) => void;
}

const ModalReceivable: React.FC<ModalProps> = ({ showModal, hideModal }) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');

    useEffect(() => {
        if (showModal) {
            setOpen(true)
        }
    }, [showModal])

    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            hideModal(false)
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        hideModal(false)
        setOpen(false);
    };

    return (
        <>
            <Modal
                title="ModalReceivable"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>{modalText}</p>
            </Modal>
        </>
    );
};

export default ModalReceivable;