import React from 'react';
import { Card, Form, Input, Button, Radio, Divider } from 'antd';
import { Settings, ShieldCheck, Palette } from 'lucide-react';
import { useTheme } from '@/theme/ThemeContext';
import { CLINICAL_PRESETS } from '@/theme/tokens';
import { useAppSelector, useAppDispatch } from '@/app/store';
import { setPractitioner } from '@/app/store/slices/sessionSlice';

export const AuthContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.session);
  const { mode, setMode, seedColor, setSeedColor } = useTheme();

  const handleSaveProfile = (values: { name: string; email: string }) => {
    dispatch(
      setPractitioner({
        id: session.practitionerId || 'practitioner-01',
        name: values.name,
        email: values.email,
      })
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary-500" />
          Practitioner Settings & Clinical Preferences
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Configure clinical display profiles, security credentials, and diagnostic themes.
        </p>
      </div>

      {/* Theme & Display Settings */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-primary-500" />
            <span className="font-semibold text-sm">Design Engine & Color Scheme</span>
          </div>
        }
        className="border-border-subtle shadow-xs"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
              Theme Mode
            </label>
            <Radio.Group
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="light">Light Mode</Radio.Button>
              <Radio.Button value="dark">Dark Mode</Radio.Button>
              <Radio.Button value="high-contrast">Clinical High-Contrast</Radio.Button>
              <Radio.Button value="system">Auto (System)</Radio.Button>
            </Radio.Group>
          </div>

          <Divider className="my-3" />

          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
              Primary Seed Color
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CLINICAL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSeedColor(preset.seed)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    seedColor.toLowerCase() === preset.seed.toLowerCase()
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-border-subtle hover:border-border-default bg-surface-card'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full inline-block mb-1.5 border border-black/10"
                    style={{ backgroundColor: preset.seed }}
                  />
                  <div className="font-semibold text-xs text-text-primary">{preset.name}</div>
                  <div className="text-[10px] text-text-muted font-mono">{preset.seed}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Practitioner Profile Information */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-primary-500" />
            <span className="font-semibold text-sm">Practitioner Credentials</span>
          </div>
        }
        className="border-border-subtle shadow-xs"
      >
        <Form
          layout="vertical"
          initialValues={{
            name: session.practitionerName || '',
            email: session.practitionerEmail || '',
          }}
          onFinish={handleSaveProfile}
        >
          <Form.Item label="Practitioner Full Name" name="name">
            <Input size="large" className="rounded-xl" />
          </Form.Item>
          <Form.Item label="Clinical Practice Email" name="email">
            <Input size="large" className="rounded-xl" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Save Preferences
          </Button>
        </Form>
      </Card>
    </div>
  );
};
export default AuthContainer;
