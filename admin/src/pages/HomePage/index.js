/*
 *
 * HomePage
 *
 */

import { BaseHeaderLayout, ContentLayout } from '@strapi/design-system/Layout';
import { Box, Button, Divider, ToggleInput, Tooltip, Typography } from '@strapi/design-system';
import { Check, Information } from '@strapi/icons';
import React, { useEffect, useRef, useState } from 'react';
import { auth, useNotification } from '@strapi/helper-plugin';

import { Helmet } from 'react-helmet';
import axios from 'axios';
import pluginId from '../../utils/pluginId';
import pluginPkg from '../../../../package.json';

const name = pluginPkg.strapi.displayName;

const HomePage = () => {
  const toggleNotification = useNotification();
  const [loading, setLoading] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const mockEnabledRef = useRef('');

  const instance = axios.create({
    baseURL: process.env.STRAPI_ADMIN_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${auth.getToken()}`,
      'Content-Type': 'application/json',
    },
  });

  const [novaMockConfigStore, setNovaMockConfigStore] = useState({
    mockEnabled: false,
  });
  const [novaMockPluginConfig, setNovaMockPluginConfig] = useState({});

  const setDataStore = (data) => {
    setNovaMockConfigStore(data);
    // update the refs
    mockEnabledRef.current = data.mockEnabled;
  };
  const setDataPlugin = (data) => {
    setNovaMockPluginConfig(data);
  };

  const handleNovaMockConfigStoreChange = (key) => (e) => {
    // update the refs
    setNovaMockConfigStore({
      ...novaMockConfigStore,
      [key]: e.target.checked,
    });
    switch (key) {
      case 'mockEnabled':
        setHasChanged(!hasChanged);
        mockEnabledRef.current = e.target.checked;
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setLoading(true);
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
    const config = {
      mockEnabled: mockEnabledRef.current,
    };
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
          background="secondary200"
          paddingRight={4}
          paddingBottom={4}
          hasRadius
        >
          <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="alpha">WARNING:</Typography>
          </Box>
          <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="omega">
              This plugin, when activated, will not modify your data stored in Strapi, but will
              replace thems in the API calls.
            </Typography>
          </Box>
          <Box paddingLeft={4} paddingRight={4} marginTop={4} marginBottom={2}>
            <Divider />
          </Box>
          <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="omega">
              It will automatically generate the necessary data to generate a complete schema for
              your GraphQL frontend.
            </Typography>
          </Box>
          <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="omega" fontWeight="bold">
              But the data will not be consistent (id, images, etc.) so your frontend will not be
              able to use them further than the schema construction. After generating the schema,
              disable the mock and resume your development.
            </Typography>
          </Box>
          <Box paddingLeft={4} paddingRight={4} marginTop={4} marginBottom={2}>
            <Divider />
          </Box>
          <Box paddingTop={2} paddingLeft={4} paddingRight={4}>
            <Typography variant="omega">Clean your front caches before and after.</Typography>
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
          <ToggleInput
            id="enable-auto-mock-datas"
            name="enable-auto-mock-datas"
            hint="Auto Mock Datas"
            label="Enabled"
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
            <Typography variant="omega">
              - An object containing the apis to be mocked →{' '}
              <code>apisToMock: {`{'api::yourct.yourct': true}`}</code>.
            </Typography>
            <Typography variant="omega">
              <em>true, false, whatever.</em>
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
        </Box>
      </ContentLayout>
    </>
  );
};

export default HomePage;
