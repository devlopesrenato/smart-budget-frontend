import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';

interface ModalProps {
    showModal: boolean;
    hideModal: (value: boolean) => void;
}

const ModalPayable: React.FC<ModalProps> = ({ showModal, hideModal }) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');

    useEffect(() => {
        if (showModal) {
            setOpen(true)
        }
    }, [showModal])

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            hideModal(false)
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
                title="ModalPayable"
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

export default ModalPayable;