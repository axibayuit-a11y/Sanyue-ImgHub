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

            <!-- 联盟分布索引 -->
            <h3 class="first-title">{{ $t('others.federation') }}
                <el-tooltip placement="right" raw-content>
                    <template #content>
                        <div style="max-width: 320px; line-height: 1.6;">
                            {{ $t('others.federationTip') }}
                        </div>
                    </template>
                    <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                </el-tooltip>
            </h3>
            <el-form :model="settings.federation" label-width="120px">
                <el-form-item :label="$t('others.enable')">
                    <el-switch v-model="settings.federation.enabled"></el-switch>
                </el-form-item>
                <el-form-item>
                    <template #label>
                        <span>{{ $t('others.serverId') }}</span>
                        <el-tooltip :content="$t('others.serverIdTip')" placement="right">
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-input v-model="settings.federation.serverId" :placeholder="$t('others.serverIdPlaceholder')" :disabled="!settings.federation.enabled"></el-input>
                </el-form-item>
                <el-form-item>
                    <template #label>
                        <span>{{ $t('others.githubRepo') }}</span>
                        <el-tooltip :content="$t('others.githubRepoTip')" placement="right">
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-input v-model="settings.federation.githubRepo" :placeholder="$t('others.githubRepoPlaceholder')" :disabled="!settings.federation.enabled"></el-input>
                </el-form-item>
                <el-form-item :label="$t('others.githubToken')">
                    <el-input v-model="settings.federation.githubToken" type="password" show-password autocomplete="new-password" placeholder="ghp_xxxx" :disabled="!settings.federation.enabled"></el-input>
                </el-form-item>
                <el-form-item>
                    <template #label>
                        <span>{{ $t('others.syncInterval') }}</span>
                        <el-tooltip :content="$t('others.syncIntervalTip')" placement="right">
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-input-number v-model="settings.federation.syncInterval" :min="1" :max="168" :disabled="!settings.federation.enabled"></el-input-number>
                    <span style="margin-left: 8px; color: var(--el-text-color-secondary);">{{ $t('others.hours') }}</span>
                </el-form-item>
                <el-form-item :label="$t('others.syncActions')">
                    <el-button type="primary" @click="syncNow" :loading="syncing" :disabled="!settings.federation.enabled || !settings.federation.serverId">
                        {{ $t('others.syncNow') }}
                    </el-button>
                    <el-button @click="testConnection" :loading="testing" :disabled="!settings.federation.enabled || !settings.federation.githubToken">
                        {{ $t('others.testConnection') }}
                    </el-button>
                </el-form-item>
                <el-form-item v-if="syncStatus.lastSync" :label="$t('others.lastSync')">
                    <span style="color: var(--el-text-color-secondary);">{{ formatTime(syncStatus.lastSync) }}</span>
                    <el-tag v-if="syncStatus.success" type="success" size="small" style="margin-left: 8px;">{{ $t('common.success') }}</el-tag>
                    <el-tag v-else type="danger" size="small" style="margin-left: 8px;">{{ $t('common.failed') }}</el-tag>
                </el-form-item>
                <!-- 远程服务器列表 -->
                <el-form-item v-if="federationStatus.remoteServers && federationStatus.remoteServers.length > 0" :label="$t('others.remoteServers')">
                    <div class="remote-servers-list">
                        <div v-for="server in federationStatus.remoteServers" :key="server.serverId" class="remote-server-item">
                            <span class="server-name">{{ server.serverName || server.serverId }}</span>
                            <span class="server-files">{{ server.fileCount }} {{ $t('common.files') }}</span>
                            <span class="server-time">{{ formatTime(server.timestamp) }}</span>
                        </div>
                        <div class="remote-servers-total">
                            {{ $t('others.totalRemoteFiles') }}: {{ federationStatus.totalRemoteFiles }}
                        </div>
                    </div>
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
            publicBrowse: {},
            federation: {
                enabled: false,
                serverId: '',
                githubRepo: '',
                githubToken: '',
                syncInterval: 24
            }
        },
        // 加载状态
        loading: false,
        syncing: false,
        testing: false,
        syncStatus: {
            lastSync: null,
            success: false
        },
        federationStatus: {
            remoteServers: [],
            totalRemoteFiles: 0
        }
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
    },
    async syncNow() {
        this.syncing = true;
        try {
            const response = await fetchWithAuth('/api/manage/federation/sync', {
                method: 'POST'
            });
            const result = await response.json();
            if (result.success) {
                // 显示详细同步结果
                const uploadMsg = `${this.$t('others.uploadSuccess')}: ${result.upload?.fileCount || 0} ${this.$t('common.files')}`;
                const downloadMsg = `${this.$t('others.downloadSuccess')}: ${result.download?.syncedServers || 0} ${this.$t('others.servers')}`;
                this.$message.success(`${uploadMsg}, ${downloadMsg}`);
                this.syncStatus.lastSync = Date.now();
                this.syncStatus.success = true;
                // 刷新联盟状态
                this.fetchFederationStatus();
            } else {
                this.$message.error(result.error || this.$t('others.syncFailed'));
                this.syncStatus.success = false;
            }
        } catch (error) {
            this.$message.error(this.$t('others.syncFailed'));
            this.syncStatus.success = false;
        } finally {
            this.syncing = false;
        }
    },
    async testConnection() {
        this.testing = true;
        try {
            const response = await fetchWithAuth('/api/manage/federation/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    githubToken: this.settings.federation.githubToken,
                    githubRepo: this.settings.federation.githubRepo
                })
            });
            const result = await response.json();
            if (result.success) {
                // 显示详细信息
                const msg = result.repoExists 
                    ? `${this.$t('others.connectionSuccess')} - ${result.repoName}`
                    : `${this.$t('others.connectionSuccess')} - ${result.hint}`;
                this.$message.success(msg);
            } else {
                this.$message.error(result.error || this.$t('others.connectionFailed'));
            }
        } catch (error) {
            this.$message.error(this.$t('others.connectionFailed'));
        } finally {
            this.testing = false;
        }
    },
    formatTime(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString();
    },
    async fetchFederationStatus() {
        try {
            const response = await fetchWithAuth('/api/manage/federation/status');
            const status = await response.json();
            if (status.syncStatus) {
                this.syncStatus.lastSync = status.syncStatus.lastSync;
                this.syncStatus.success = status.syncStatus.uploadSuccess && status.syncStatus.downloadSuccess;
            }
            this.federationStatus = status;
        } catch (error) {
            console.error('Failed to fetch federation status:', error);
        }
    }
},
mounted() {
    this.loading = true;
    // 获取其他设置
    fetchWithAuth('/api/manage/sysConfig/others')
    .then((response) => response.json())
    .then((data) => {
        this.settings = data;
        // 如果联盟已启用，获取联盟状态
        if (data.federation?.enabled) {
            this.fetchFederationStatus();
        }
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

/* 远程服务器列表样式 */
.remote-servers-list {
    width: 100%;
    max-width: 400px;
}

.remote-server-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    margin-bottom: 8px;
    background: var(--el-fill-color);
    border-radius: 8px;
    font-size: 13px;
}

.server-name {
    font-weight: 500;
    color: var(--el-text-color-primary);
    flex: 1;
}

.server-files {
    color: var(--el-color-primary);
    margin: 0 12px;
}

.server-time {
    color: var(--el-text-color-secondary);
    font-size: 12px;
}

.remote-servers-total {
    padding: 8px 12px;
    text-align: right;
    font-weight: 600;
    color: var(--el-text-color-primary);
    border-top: 1px solid var(--el-border-color-lighter);
    margin-top: 8px;
}
</style>