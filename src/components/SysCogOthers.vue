<template>
    <div class="others-settings" v-loading="loading">
        <!-- 一级设置：其他设置 -->
        <div class="first-settings">
            <h3 class="first-title">{{ $t('others.remoteTelemetry') }}
                <el-tooltip :content="$t('others.telemetryTip')" placement="right">
                    <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                </el-tooltip>
            </h3>
            <el-form :model="settings.telemetry" label-width="120px">
                <el-form-item :label="$t('others.enable')">
                    <el-switch v-model="settings.telemetry.enabled" :disabled="settings.telemetry.fixed"></el-switch>
                </el-form-item>
            </el-form>
            <h3 class="first-title">{{ $t('others.randomImageAPI') }}
                <el-tooltip :content="$t('others.randomImageTip')" placement="right">
                    <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                </el-tooltip>
            </h3>
            <el-form :model="settings.randomImageAPI" label-width="120px">
                <el-form-item :label="$t('others.enable')">
                    <el-switch v-model="settings.randomImageAPI.enabled" :disabled="settings.randomImageAPI.fixed"></el-switch>
                </el-form-item>
                <el-form-item prop="randomImageAPI.allowedDir">
                    <template #label>
                        <span>{{ $t('others.directory') }}</span>
                        <el-tooltip :content="$t('others.directoryTip')" placement="right" raw-content>
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-input v-model="settings.randomImageAPI.allowedDir" :disabled="settings.randomImageAPI.fixed"></el-input>
                </el-form-item>
            </el-form>
            <h3 class="first-title">{{ $t('others.publicBrowse') }}
                <el-tooltip :content="$t('others.publicBrowseTip')" placement="right" raw-content>
                    <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                </el-tooltip>
            </h3>
            <el-form :model="settings.publicBrowse" label-width="120px">
                <el-form-item :label="$t('others.enable')">
                    <el-switch v-model="settings.publicBrowse.enabled" :disabled="settings.publicBrowse.fixed"></el-switch>
                </el-form-item>
                <el-form-item prop="publicBrowse.allowedDir">
                    <template #label>
                        <span>{{ $t('others.openDirectory') }}</span>
                        <el-tooltip placement="right" raw-content>
                            <template #content>
                                <div style="max-width: 320px; line-height: 1.6;">
                                    <p style="margin: 0 0 8px 0;"><b>{{ $t('others.openDirectoryTip') }}</b></p>
                                    <p style="margin: 0 0 8px 0;">{{ $t('others.openDirectoryExample') }}</p>
                                    <p style="margin: 0 0 8px 0; color: #909399;">{{ $t('others.openDirectorySubdir') }}</p>
                                    <p style="margin: 0; color: #67c23a;">{{ $t('others.openDirectoryLink') }}</p>
                                </div>
                            </template>
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-input v-model="settings.publicBrowse.allowedDir" :disabled="settings.publicBrowse.fixed" placeholder="wallpaper,photos,album"></el-input>
                </el-form-item>
            </el-form>
            <h3 class="first-title">{{ $t('others.cloudflareApiToken') }}
                <el-tooltip :content="$t('others.cloudflareApiTip')" placement="right" raw-content>
                    <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                </el-tooltip>
            </h3>
            <el-form :model="settings.cloudflareApiToken" label-width="120px">
                <el-form-item :label="$t('others.zoneId')">
                    <el-input v-model="settings.cloudflareApiToken.CF_ZONE_ID" :disabled="settings.cloudflareApiToken.fixed"></el-input>
                </el-form-item>
                <el-form-item :label="$t('others.accountEmail')">
                    <el-input v-model="settings.cloudflareApiToken.CF_EMAIL" :disabled="settings.cloudflareApiToken.fixed"></el-input>
                </el-form-item>
                <el-form-item label="API Key">
                    <el-input v-model="settings.cloudflareApiToken.CF_API_KEY" :disabled="settings.cloudflareApiToken.fixed" type="password" show-password autocomplete="new-password"></el-input>
                </el-form-item>
            </el-form>
            <h3 class="first-title">{{ $t('others.webDAV') }}
                <el-tooltip :content="$t('others.webDAVTip')" placement="right" raw-content>
                    <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                </el-tooltip>
            </h3>
            <el-form :model="settings.webDAV" label-width="120px">
                <el-form-item :label="$t('others.enable')">
                    <el-switch v-model="settings.webDAV.enabled" :disabled="settings.webDAV.fixed"></el-switch>
                </el-form-item>
                <el-form-item :label="$t('security.username')">
                    <el-input v-model="settings.webDAV.username" :disabled="settings.webDAV.fixed"></el-input>
                </el-form-item>
                <el-form-item :label="$t('security.password')">
                    <el-input v-model="settings.webDAV.password" :disabled="settings.webDAV.fixed" type="password" show-password autocomplete="new-password"></el-input>
                </el-form-item>
            </el-form>
        </div>

    
        <!-- 保存按钮 -->
        <div class="actions">
            <el-button type="primary" @click="saveSettings">{{ $t('others.saveSettings') }}</el-button>
        </div>
    </div>
</template>

<script>
import fetchWithAuth from '@/utils/fetchWithAuth';

export default {
data() {
    return {
        settings: {
            telemetry: {},
            randomImageAPI: {},
            cloudflareApiToken: {},
            webDAV: {},
            publicBrowse: {}
        },
        // 加载状态
        loading: false
    };
},
computed: {
},
methods: {
    saveSettings() {
        fetchWithAuth('/api/manage/sysConfig/others', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.settings)
        })
        .then(() => this.$message.success(this.$t('message.settingsSaved')));
    }
},
mounted() {
    this.loading = true;
    // 获取上传设置
    fetchWithAuth('/api/manage/sysConfig/others')
    .then((response) => response.json())
    .then((data) => {
        this.settings = data;
    })
    .finally(() => {
        this.loading = false;
    });
}
};
</script>

<style scoped>
.others-settings {
    padding: 20px;
    min-height: 500px;
}

.first-settings {
    margin-bottom: 40px;
}

.first-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--el-color-primary-light-7);
}

.second-title {
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: start;
    margin-left: 0;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--el-border-color-lighter);
}

/* 表单样式 - 上下排列左对齐 */
.first-settings :deep(.el-form) {
    padding: 16px 20px;
    background: var(--el-fill-color-lighter);
    border-radius: 12px;
    border: 1px solid var(--el-border-color-lighter);
    margin-bottom: 20px;
}

.first-settings :deep(.el-form-item) {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.first-settings :deep(.el-form-item:last-child) {
    margin-bottom: 0;
}

.first-settings :deep(.el-form-item__label) {
    text-align: left;
    padding-bottom: 8px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    width: auto !important;
}

.first-settings :deep(.el-form-item__content) {
    width: 100%;
    max-width: 400px;
    margin-left: 0 !important;
}

.first-settings :deep(.el-input) {
    width: 100%;
}

.first-settings :deep(.el-switch) {
    --el-switch-on-color: var(--el-color-primary);
}

.actions {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.actions :deep(.el-button) {
    border-radius: 8px;
    padding: 10px 20px;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .others-settings {
        padding: 15px;
    }
    
    .first-settings :deep(.el-form) {
        padding: 12px 15px;
    }
    
    .first-settings :deep(.el-form-item__content) {
        max-width: 100%;
    }
}
</style>