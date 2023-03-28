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

console.log(`homepage`, pluginId);
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

  const [novaMockConfig, setNovaMockConfig] = useState({
    mockEnabled: false,
  });

  const setData = (data) => {
    setNovaMockConfig(data);
    // update the refs
    mockEnabledRef.current = data.mockEnabled;
  };

  const handleNovaMockConfigChange = (key) => (e) => {
    console.log('key', e.target.checked);
    // update the refs
    setNovaMockConfig({
      ...novaMockConfig,
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
    const fetchNovaMockerConfig = async () => {
      try {
        const { data } = await instance.get('/nova-datas-mocker/config');
        setData(data);
      } catch (error) {
        console.log(error);
        toggleNotification({
          type: 'warning',
          message: {
            id: 'nova-datas-mocker-config-fetch-error',
            defaultMessage: 'Error while fetching the Nova Datas Mocker configurations',
          },
        });
      }
    };
    fetchNovaMockerConfig();
    setLoading(false);
  }, []);

  const handelSave = async () => {
    const config = {
      mockEnabled: mockEnabledRef.current,
    };
    setLoading(true);

    try {
      const { data } = await instance.post('/nova-datas-mocker/config/update', {
        ...novaMockConfig,
      });
      if (data && data.value) {
        setData(JSON.parse(data.value));
      }
      setLoading(false);
      setHasChanged(false);
      toggleNotification({
        type: 'success',
        message: {
          id: 'nova-datas-mocker-config-save-success',
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
          id: 'nova-datas-mocker-config-save-error',
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
        <Box paddingTop={2} paddingLeft={4}>
          <Typography variant="omega" fontWeight="semiBold">
            You must set in the plugin configuration:
          </Typography>
        </Box>
        <Box paddingTop={2} paddingLeft={4}>
          <Typography variant="pi">
            - Indicates the depth (child level) of the data to be mocked →{' '}
            <code>defaultDepth: 5</code> ;
          </Typography>
        </Box>
        <Box paddingTop={2} paddingLeft={4}>
          <Typography variant="pi">
            - The default type of mock for your Custom Fiedls →{' '}
            <code>customFields: {`{'plugin::name':'type'}`}</code> ;
          </Typography>
        </Box>
        <Box paddingTop={2} paddingLeft={4}>
          <Typography variant="pi">
            - The list of plugins not to be replaced by mocked datas →{' '}
            <code>customFields: {`['plugin::name']`}</code>.
          </Typography>
        </Box>
        <Box padding={8}>
          <Divider />
        </Box>
        <Box
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
            checked={novaMockConfig.mockEnabled}
            refs={mockEnabledRef}
            onChange={handleNovaMockConfigChange('mockEnabled')}
          />
        </Box>
      </ContentLayout>
    </>
  );
};

export default HomePage;
