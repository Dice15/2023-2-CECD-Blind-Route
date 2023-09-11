import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';
import { ModalAnimationType, ModalAnimationMotion, ModalAnimation } from './ModalAnimations';



///////////////////////////////////////////////////////
/** 모달 필드 관리 Hook*/
export default function useModalCreater() {
    useEffect(() => {
        const pageBody = document.body;
        const div = document.createElement('div');
        div.id = "modal";
        pageBody.appendChild(div);
        return () => { pageBody.removeChild(div); };
    }, []);
}



///////////////////////////////////////////////////////
/** ModalPortal 프로퍼티 */
interface ModalPortalProps {
    children: React.ReactNode;
}

/** ModalPortal */
function ModalPortal({ children }: ModalPortalProps) {
    const modalRoot = document.getElementById('modal') as HTMLElement;
    return ReactDOM.createPortal(children, modalRoot);
};



///////////////////////////////////////////////////////
/** ModalWrapper 프로퍼티 */
interface ModalWrapperProps {
    backgroundColor: string;
};


/** ModalWrapper */
const ModalWrapper = styled.div.withConfig({ shouldForwardProp: (prop) => !['backgroundColor'].includes(prop) }) <ModalWrapperProps>`
  position: fixed;
  left: 0;
  top: 0;

  z-index: 1050;
  width: 100%;
  height: 100%;

  background-color: ${({ backgroundColor }) => backgroundColor};
`;



///////////////////////////////////////////////////////
/** ModalInner 프로퍼티 */
interface ModalInnerProps {
    modalAnimationMotion: ModalAnimationMotion;
    isUnmount: boolean;
};

/** ModalInner */
const ModalInner = styled.div.withConfig({ shouldForwardProp: (prop) => !['modalAnimationMotion', 'isUnmount'].includes(prop) }) <ModalInnerProps>`
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;

  background-color: transparent;

  display: flex;
  align-items: center;
  justify-content: center;

  ${({ modalAnimationMotion: modalAnimation, isUnmount }) => css`
  animation: ${isUnmount ? modalAnimation.onDisappear : modalAnimation.onAppear} ${modalAnimation.duration / 1000}s ease-in-out;
  `}
`;



///////////////////////////////////////////////////////
/** 모달 프로퍼티 */
interface ModalFrameProps {
    modalAnimation: ModalAnimationMotion;
    isUnmount: boolean;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    backgroundColor: string;
}

/** 모달 컴포넌트 */
function ModalFrame({ modalAnimation, isUnmount, isOpen, onClose, children, backgroundColor }: ModalFrameProps) {
    const handleClickInnerModal = (e: React.MouseEvent<HTMLDivElement>) => {
        // ModalWrapper로 이벤트 전파 방지
        e.stopPropagation();
    };
    return (
        <>
            {isOpen && (
                <ModalPortal>
                    <ModalWrapper
                        backgroundColor={backgroundColor}
                        onClick={onClose}
                    >
                        <ModalInner
                            onClick={onClose}
                            modalAnimationMotion={modalAnimation}
                            isUnmount={isUnmount}
                        >
                            <div onClick={handleClickInnerModal}>
                                {children}
                            </div>
                        </ModalInner>
                    </ModalWrapper>
                </ModalPortal>
            )}
        </>
    );
};



///////////////////////////////////////////////////////
/** 모달 관리 Hook */
export function useModal(modalAnimation: ModalAnimationType, backgroundColor: string = "#0b0b0bb8"): [
    ({ children }: { children: React.ReactNode; }) => JSX.Element,
    () => void,
    () => void,
] {
    /** state */
    const [isOpen, setIsOpen] = useState(false);
    const [isUnmount, setIsUnmount] = useState(false);

    /** animation */
    const animation = ModalAnimation.getAnimationModtion(modalAnimation);

    /** 모달 닫기 */
    const closeModal = () => {
        setIsUnmount(true);
        setTimeout(() => {
            setIsOpen(false);
        }, animation.duration);
    };

    /** 모달 열기 */
    const openModal = () => {
        setIsUnmount(false)
        setIsOpen(true);
    };

    /** 모달 */
    const Modal = ({ children }: { children: React.ReactNode }) => (
        <ModalFrame
            isOpen={isOpen}
            onClose={closeModal}
            isUnmount={isUnmount}
            modalAnimation={animation}
            backgroundColor={backgroundColor}
        >
            {children}
        </ModalFrame>
    );

    return [Modal, openModal, closeModal];
};