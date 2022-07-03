import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
    ButtonGroup,
    Flex,
    FormControl,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
  } from '@chakra-ui/react';
  import React, { useEffect, useState } from 'react';
  import { FaArrowLeft, FaArrowRight, FaFilter, FaSearch } from 'react-icons/fa';
  import HackathonCard from './HackathonCard';
  import Logo from './Logo';
import ProjectCard from './ProjectCard';
  
  const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [perPage, setPerPage] = useState(3);
    const [totalRecords, setTotalRecords] = useState(0);
    const [more, setMore] = useState(false);
    const [query, setQuery] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [page, setPage] = useState(0);
    let fetchData = async () => {
      console.log(perPage);
      setLoading(true);
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/projects?q=${query}&page=${page}&per_page=${perPage}&`
        );
        console.log(res.status);
        if (res.status === 200) {
          const data = await res.json();
          console.log(data);
          setTotalRecords(data.meta.total);
          setProjects(data.data);
          setError(null);
        } else {
          const data = await res.json();
          let errorMessage = new Error(data.detail);
          setError(errorMessage);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      fetchData();
    }, [perPage, page]);
    return (
      <>
        <Flex justifyContent={'flex-end'}>
          <IconButton icon={<FaFilter />} onClick={onOpen} />
        </Flex>
        <Flex
          wrap={'wrap'}
          justifyContent={'space-evenly'}
          minH={'75vh'}
          align={'center'}
        >
          {loading ? (
            <Text
              fontSize="2xl"
              fontFamily={`'Source Code Pro', sans-serif`}
              color={'cyan'}
              fontWeight="bold"
            >
              <Logo fontSize={'4xl'} />
            </Text>
          ) : error ? (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Error! </AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ) : (
            projects.map(hackathon => (
              <ProjectCard
                key={hackathon['_id']}
                id = {hackathon['_id']}
                title={hackathon['title']}
                description={hackathon['description']}
                heroImage={hackathon['hero_image']}
                logo={hackathon['image']}
                idea = {hackathon['idea']}
                userName = {hackathon['user_name']}
              />
            ))
          )}
        </Flex>
        <Flex justifyContent={'flex-end'} m={5}>
          <ButtonGroup display={more ? 'flex' : 'none'} mr={'10'}>
            <IconButton
              icon={<FaArrowLeft />}
              onClick={() => setPage(page - 1)}
              disabled={page === 0 ? true : false}
            >
              Previous
            </IconButton>
            <IconButton
              icon={<FaArrowRight />}
              disabled={
                Math.floor(totalRecords / perPage) === page ? true : false
              }
              onClick={() => setPage(page + 1)}
            >
              Next
            </IconButton>
          </ButtonGroup>
          <Button
            colorScheme={'teal'}
            display={loading ? 'none' : 'flex'}
            onClick={() => {
              setPerPage(more ? 3 : 10);
              setPage(0);
              setMore(!more);
            }}
          >
            Show {more ? 'less' : 'more'}
          </Button>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Filter Results</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    fontSize="1.2em"
                    children={<FaSearch />}
                  />
                  <Input
                    placeholder="Search"
                    value={query}
                    onChange={e => {
                      setQuery(e.target.value);
                    }}
                  />
                </InputGroup>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button onClick={fetchData} mr={5} colorScheme={'teal'}>
                Apply
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default Projects;
  