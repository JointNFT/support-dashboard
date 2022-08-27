import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure
  } from '@chakra-ui/react';

export default function ImageModal({src}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
      <img
        src={src}
        style={{
          minWidth: 180,
          maxWidth: 230,
          minHeight: 180,
          maxHeight: 230,
          borderRadius: 6,
          objectFit: "cover",
          cursor: "pointer",
        }}
        referrerPolicy="no-referrer"
        onClick={onOpen}
      />
  
        <Modal isOpen={isOpen} onClose={onClose} size="full">
          <ModalOverlay />
          <ModalContent style={{backgroundColor: '#444444'}}>
            <ModalHeader style={{color: 'white'}}>Photo</ModalHeader>
            <ModalCloseButton style={{color: 'white'}}/>
            <ModalBody className='d-flex align-items-center justify-content-center' >
            <img src={src} style={{maxHeight: '100%', maxWidth: '100%'}}/>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  }