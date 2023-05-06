/*
 *
 * HomePage
 *
 */

import { BaseHeaderLayout, ContentLayout } from '@strapi/design-system/Layout';
import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  Stack,
  ToggleInput,
  Tooltip,
  Typography,
} from '@strapi/design-system';
import { Check, Information } from '@strapi/icons';
import React, { useEffect, useRef, useState } from 'react';
import { auth, useNotification } from '@strapi/helper-plugin';

import { Helmet } from 'react-helmet';
import _ from 'lodash';
import axios from 'axios';
import pluginId from '../../utils/pluginId';
import pluginPkg from '../../../../package.json';

const name = pluginPkg.strapi.displayName;

const HomePage = () => {
  const toggleNotification = useNotification();
  const [loading, setLoading] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const mockEnabledRef = useRef('');
  const addImageEnabledRef = useRef('');

  const instance = axios.create({
    baseURL: process.env.STRAPI_ADMIN_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${auth.getToken()}`,
      'Content-Type': 'application/json',
    },
  });

  const [novaMockConfigStore, setNovaMockConfigStore] = useState({
    mockEnabled: false,
    addImageInRichtextEnabled: false,
  });
  const [actualNovaMockConfigStore, setActualNovaMockConfigStore] = useState({
    mockEnabled: false,
    addImageInRichtextEnabled: false,
  });
  const [novaMockPluginConfig, setNovaMockPluginConfig] = useState({});
  const [strapiAPIsList, setStrapiAPIsList] = useState([]);

  const setDataStore = (data) => {
    setNovaMockConfigStore(data);
    setActualNovaMockConfigStore(data);
    // update the refs
    mockEnabledRef.current = data.mockEnabled;
    addImageEnabledRef.current = data.addImageInRichtextEnabled;
  };
  const setDataPlugin = (data) => {
    setNovaMockPluginConfig(data);
  };

  const compareMockConfigStore = (local = novaMockConfigStore) => {
    for (const [_key, _value] of Object.entries(local)) {
      if (!_.has(actualNovaMockConfigStore, _key)) {
        setHasChanged(true);
      }
      if (actualNovaMockConfigStore[_key] !== local[_key]) return setHasChanged(true);
    }
    return setHasChanged(false);
  };

  const handleNovaMockConfigStoreChange = (key) => (e) => {
    // update the refs
    setNovaMockConfigStore({
      ...novaMockConfigStore,
      [key]: e.target.checked,
    });
    switch (key) {
      case 'mockEnabled':
        mockEnabledRef.current = e.target.checked;
        break;
      case 'addImageInRichtextEnabled':
        addImageEnabledRef.current = e.target.checked;
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    compareMockConfigStore();
  }, [novaMockConfigStore]);

  useEffect(() => {
    setLoading(true);
    const fetchAllStrapiAPIs = async () => {
      try {
        const { data } = await instance.get(`/${pluginId}/getAllStrapiAPIs`);
        setStrapiAPIsList(data);
      } catch (error) {
        console.log(error);
        toggleNotification({
          type: 'warning',
          message: {
            id: 'nova-datas-mocker-all-apis-fetch-error',
            defaultMessage: 'Error while fetching the Strapi APIs list',
          },
        });
      }
    };
    fetchAllStrapiAPIs();
    const fetchNovaMockerConfigStore = async () => {
      try {
        const { data } = await instance.get(`/${pluginId}/configStore`);
        setDataStore(data);
      } catch (error) {
        console.log(error);
        toggleNotification({
          type: 'warning',
          message: {
            id: 'nova-datas-mocker-config-store-fetch-error',
            defaultMessage: 'Error while fetching the Nova Datas Mocker configurations',
          },
        });
      }
    };
    fetchNovaMockerConfigStore();
    const fetchNovaMockerPluginConfig = async () => {
      try {
        const { data } = await instance.get(`/${pluginId}/configPlugin`);
        setDataPlugin(data);
      } catch (error) {
        console.log(error);
        toggleNotification({
          type: 'warning',
          message: {
            id: 'nova-datas-mocker-config-plugin-fetch-error',
            defaultMessage: 'Error while fetching the Nova Datas Mocker configurations',
          },
        });
      }
    };
    fetchNovaMockerPluginConfig();
    setLoading(false);
  }, []);

  const handelSave = async () => {
    setLoading(true);

    try {
      const { data } = await instance.post('/nova-datas-mocker/configStore/update', {
        ...novaMockConfigStore,
      });
      if (data && data.value) {
        setDataStore(JSON.parse(data.value));
      }
      setLoading(false);
      setHasChanged(false);
      toggleNotification({
        type: 'success',
        message: {
          id: 'nova-datas-mocker-config-store-save-success',
          defaultMessage: 'Nova Datas Mocker configurations saved successfully',
        },
      });
    } catch (error) {
      setHasChanged(false);
      setLoading(false);
      console.log(error);
      toggleNotification({
        type: 'warning',
        message: {
          id: 'nova-datas-mocker-config-store-save-error',
          defaultMessage: 'Error while saving the Nova Datas Mocker configurations',
        },
      });
    }
  };

  const SwitchRow = ({ item }) => {
    const toggleRef = useRef('');
    const [checked, setChecked] = useState(false);
    useEffect(() => {
      setChecked(
        _.has(novaMockConfigStore, item.apiName) ? novaMockConfigStore[item.apiName] : false
      );
    }, [actualNovaMockConfigStore]);

    const onClick = (key) => (e) => {
      // update the refs
      // Check if unchecked and valus has not already been saved
      if (!e.target.checked && !_.has(actualNovaMockConfigStore, key)) {
        console.log(`must delete!`);
        const temp = novaMockConfigStore;
        _.unset(temp, key);
        console.log(temp);
        setNovaMockConfigStore(temp);
        compareMockConfigStore(temp);
      } else {
        setNovaMockConfigStore({ ...novaMockConfigStore, [key]: e.target.checked });
        compareMockConfigStore();
      }
      setChecked(e.target.checked);
    };
    return (
      <>
        <GridItem padding={1} col={2} s={12}>
          <ToggleInput
            id={`switch-${item.prettyName}`}
            name={`switch-${item.prettyName}`}
            // label={`Activate ${item.prettyName}`}
            onLabel="True"
            offLabel="False"
            checked={checked}
            refs={toggleRef}
            onChange={onClick(item.apiName)}
          />
        </GridItem>
        <GridItem col={10} s={12} padding={5}>
          <Typography>
            {item.prettyName} → {item.apiName}
          </Typography>
        </GridItem>
      </>
    );
  };
  return (
    <>
      <Helmet title={`${name} configuration`} />
      <BaseHeaderLayout
        title={name}
        subtitle={`Mock all your datas easily!`}
        as="h2"
        primaryAction={
          <Button
            startIcon={<Check />}
            onClick={handelSave}
            loading={loading}
            disabled={!!!hasChanged}
          >
            Save
          </Button>
        }
      />
      <ContentLayout>
        <Box
          marginTop={4}
          marginBottom={4}
          paddingTop={4}
          paddingLeft={4}
          shadow="tableShadow"
          background="secondary100"
          paddingRight={4}
          paddingBottom={4}
          hasRadius
        >
          <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="omega">
              This plugin, when activated, will not modify your data stored in Strapi, but will
              replace thems in the API calls.
            </Typography>
          </Box>
          <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="alpha">WARNING:</Typography>
          </Box>
          <Box paddingLeft={4} paddingRight={4} marginTop={4} marginBottom={2}>
            <Divider />
          </Box>
          <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="omega">
              It will automatically generate the necessary data to generate a complete schema for
              your GraphQL frontend, if you added explicitly your API in the plugin configuration.
            </Typography>
          </Box>
          <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="omega" fontWeight="bold">
              IMPORTANT: The plugin could work without any data in your collections and single, but
              if you have customized some APIs (in controllers for example), they will be missing
              (default operation of Strapi). They will only be available if you have at least 1
              entry in your collections or single saved.
            </Typography>
          </Box>
          <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="omega" fontWeight="bold">
              But the data will not be consistent (id, images, etc.) so your frontend will not be
              able to use them further than the schema construction. After generating the schema,
              disable the mock and resume your development.
            </Typography>
          </Box>
          <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="omega" fontWeight="bold">
              Even if you don't have debugging enabled, check the plugin logs regularly.
            </Typography>
          </Box>
          <Box paddingLeft={4} paddingRight={4} marginTop={4} marginBottom={2}>
            <Divider />
          </Box>
          <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="omega">Tips: Clean your front caches before and after.</Typography>
          </Box>
        </Box>
        <Box
          marginTop={4}
          marginBottom={4}
          paddingTop={4}
          paddingLeft={4}
          shadow="tableShadow"
          background="neutral0"
          paddingRight={4}
          paddingBottom={4}
          hasRadius
        >
          <Stack spacing={4} padding={3}>
            <ToggleInput
              id="enable-auto-mock-datas"
              name="enable-auto-mock-datas"
              label="Auto Mock Datas"
              labelAction={
                <Tooltip description="Toogle must be set to true to mock your datas">
                  <button
                    aria-label="Information about the toogle"
                    style={{
                      border: 'none',
                      padding: 0,
                      background: 'transparent',
                    }}
                  >
                    <Information aria-hidden />
                  </button>
                </Tooltip>
              }
              onLabel="True"
              offLabel="False"
              checked={novaMockConfigStore.mockEnabled}
              refs={mockEnabledRef}
              onChange={handleNovaMockConfigStoreChange('mockEnabled')}
            />
            <ToggleInput
              id="enable-add-imagein-richtext"
              name="enable-add-imagein-richtext"
              label="Add image in Richtext"
              labelAction={
                <Tooltip description="Toogle must be set to true to add image in Richtext">
                  <button
                    aria-label="Information about the toogle"
                    style={{
                      border: 'none',
                      padding: 0,
                      background: 'transparent',
                    }}
                  >
                    <Information aria-hidden />
                  </button>
                </Tooltip>
              }
              onLabel="True"
              offLabel="False"
              checked={novaMockConfigStore.addImageInRichtextEnabled}
              refs={addImageEnabledRef}
              onChange={handleNovaMockConfigStoreChange('addImageInRichtextEnabled')}
              disabled={
                !!!novaMockPluginConfig.imageNameToUse || novaMockPluginConfig.imageNameToUse === ''
              }
              hint={
                !!!novaMockPluginConfig.imageNameToUse || novaMockPluginConfig.imageNameToUse === ''
                  ? `Disabled because config imageNameToUse is not set.`
                  : ``
              }
            />
            <Box paddingTop={2} paddingLeft={0}>
              <Typography variant="omega" fontWeight="bold">
                APIs to mock:
              </Typography>
            </Box>
            <Grid gap={5}>
              {strapiAPIsList &&
                strapiAPIsList.map((item) => {
                  return <SwitchRow item={item} key={item.apiName} />;
                })}
            </Grid>
          </Stack>
        </Box>
        <Box
          marginTop={4}
          marginBottom={4}
          paddingTop={4}
          paddingLeft={4}
          shadow="tableShadow"
          background="neutral0"
          paddingRight={4}
          paddingBottom={4}
          hasRadius
        >
          <Box paddingTop={2} paddingLeft={4}>
            <Typography variant="epsilon">You must set in the plugin configuration:</Typography>
          </Box>
          <Box paddingTop={2} paddingLeft={4}>
            <Typography variant="omega">
              - Indicates the depth (child level) of the data to be mocked →{' '}
              <code>defaultDepth: 5</code> ;
            </Typography>
          </Box>
          <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="omega">
              - The default type of mock for your Custom Fiedls →{' '}
              <code>customFields: {`{'plugin::name':'type'}`}</code> ;
            </Typography>
          </Box>
          <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="epsilon">Your actual plugin config:</Typography>
          </Box>
          <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="omega">
              <pre>{JSON.stringify(novaMockPluginConfig, undefined, 4)}</pre>
            </Typography>
          </Box>
          {/* <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="omega">
              <pre>{JSON.stringify(strapiAPIsList, undefined, 4)}</pre>
            </Typography>
          </Box> */}
          {/* <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="omega">
              <pre>{JSON.stringify(actualNovaMockConfigStore, undefined, 4)}</pre>
            </Typography>
          </Box> */}
        </Box>
      </ContentLayout>
    </>
  );
};

export default HomePage;
