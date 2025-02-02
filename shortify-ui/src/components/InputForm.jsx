import React, {useState} from "react";
import axios from "axios";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputLeftAddon,
    useClipboard,
} from "@chakra-ui/react";
import styles from "./InputForm.module.css";

export const InputForm = () => {
    const [input, setInput] = useState({longUrl: "", urlCode: ""});
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const {hasCopied, onCopy} = useClipboard(url);
    const clientBaseUrl = window.location.href;

    const handleInputChange = (e) => {
        const {id, value} = e.target;
        setInput({...input, [id]: value});
        setIsError(false);
    };

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (!input.longUrl) {
            setIsError(true);
            setUrl("Please enter a URL to shorten.");
            return;
        }
        setIsLoading(true);
        axios
            .post("/api/url/shorten", input)
            .then((res) => {
                if (res.status) {
                    let data = res.data;
                    let createUrl = clientBaseUrl + data.urlCode;
                    setUrl(createUrl);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                let errorMsg = error.response.data.error;
                setUrl(errorMsg);
                setIsLoading(false);
            });
    };

    return (
        <Box
            width="40%"
            margin="auto"
            boxShadow="dark-lg"
            p={4}
            rounded="2xl"
            bg="dark"
            className={styles.mainContainer}
        >
            <FormControl isInvalid={isError}>
                <FormLabel fontSize="sm">
                    Enter the URL you want to shorten:
                </FormLabel>
                <Input
                    id="longUrl"
                    type="url"
                    value={input.longUrl}
                    placeholder="e.g., https://www.example.com/long-page"
                    onChange={handleInputChange}
                    onKeyDown={handleEnter}
                    size="sm"
                />
                {!isError ? (
                    <FormHelperText fontSize="xs">
                        Paste your full URL here.
                    </FormHelperText>
                ) : (
                    <FormErrorMessage fontSize="xs">
                        A valid URL is required.
                    </FormErrorMessage>
                )}
            </FormControl>
            <FormLabel mt={3} fontSize="sm">
                Customize your short link:
            </FormLabel>
            <InputGroup size="sm" className={styles.InputGroup}>
                <InputLeftAddon children={clientBaseUrl} w="50"/>
                <Input
                    placeholder="Enter a custom alias (if desired)"
                    id="urlCode"
                    type="text"
                    value={input.urlCode}
                    onChange={handleInputChange}
                    w="50%"
                    onKeyDown={handleEnter}
                    size="sm"
                />
            </InputGroup>
            <Button
                type="submit"
                colorScheme="blue"
                m={3}
                onClick={handleSubmit}
                isLoading={isLoading}
                loadingText="Generating..."
                size="sm"
            >
                Generate Short Link
            </Button>
            {url && (
                <Flex mb={2}>
                    <Input
                        value={url}
                        isReadOnly
                        placeholder="Your shortened URL appears here"
                        size="sm"
                    />
                    <Button onClick={onCopy} ml={2} size="sm">
                        {hasCopied ? "Copied" : "Copy"}
                    </Button>
                </Flex>
            )}
        </Box>
    );
};