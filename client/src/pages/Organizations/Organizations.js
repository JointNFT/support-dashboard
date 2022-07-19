import { Box, Flex, Heading } from '@chakra-ui/react'
import React from 'react'
import OrganizationCard from './OrganizationCard'
import AddOrganization from './AddOrganization'

const Organizations = () => {
	return (
		<Box
      w={"100%"}
      height={{
        base: "100vh",
        md: "auto",
        sm: "auto",
      }}
      bg="blue.100"
      paddingBottom="32"
    >
      <Heading w={"90%"} mx="auto" fontSize={'26px'} mb='20px' pt='20px' textAlign={'center'}>
        Select organization
      </Heading>
      <Flex
        justifyContent="center"
        height={"100%"}
        width="90%"
        mx={"auto"}
        gap="30px"
        flexWrap={"wrap"}
        flexDirection={{ lg: "row", md: "column", sm: "column" }}
      >
        <OrganizationCard />
        <OrganizationCard />
        <OrganizationCard />
        <AddOrganization />
      </Flex>
    </Box>
	)
}

export default Organizations