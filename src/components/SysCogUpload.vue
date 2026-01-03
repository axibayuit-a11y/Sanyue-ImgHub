<template>
    <div class="upload-settings" v-loading="loading">   
        <!-- 一级设置：上传渠道 -->
        <div class="upload-channel">
        <h3 class="first-title">{{ $t('uploadChannel.title') }}
            <el-tooltip :content="$t('uploadChannel.channelTip')" placement="right" raw-content>
                <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
            </el-tooltip>
        </h3>
        <el-radio-group v-model="activeChannel">
            <el-radio
            v-for="channel in channels"
            :key="channel.value"
            :label="channel.value"
            >
            {{ channel.label }}
            </el-radio>
        </el-radio-group>
        </div>

        <!-- 二级设置：具体渠道配置 -->
        <div class="channel-settings">
        <h4 class="second-title">{{ activeChannelLabel }} {{ $t('uploadChannel.settings') }}
            <el-tooltip v-if="activeChannel === 'telegram'" :content="$t('uploadChannel.telegramTip')" placement="right">
                <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
            </el-tooltip>
        </h4>
        <div v-if="activeChannel === 'telegram'">
            <!-- 负载均衡配置 -->
            <el-form 
                :model="telegramSettings" 
                label-position="top"
                class="channel-form"
            >
                <el-form-item :label="$t('uploadChannel.loadBalance')">
                    <el-switch v-model="telegramSettings.loadBalance.enabled"/>
                </el-form-item>
            </el-form>

            <el-form
                v-for="(channel, index) in telegramSettings.channels"
                :key="index"
                :model="channel"
                label-position="top"
                :rules = "tgRules"
                ref = "tgChannelForm"
                class="channel-form"
            >
                <el-form-item :label="$t('uploadChannel.channelName')" prop="name">
                    <el-input v-model="channel.name" :disabled="channel.fixed"/>
                </el-form-item>
                <el-form-item :label="$t('uploadChannel.enableChannel')" prop="enabled">
                    <el-switch v-model="channel.enabled"/>
                </el-form-item>
                <el-form-item :label="$t('uploadChannel.botToken')" prop="botToken">
                    <el-input v-model="channel.botToken" :disabled="channel.fixed" type="password" show-password autocomplete="new-password"/>
                </el-form-item>
                <el-form-item :label="$t('uploadChannel.chatId')" prop="chatId">
                    <el-input v-model="channel.chatId" :disabled="channel.fixed" type="password" show-password autocomplete="new-password"/>
                </el-form-item>
                <!-- 删除 -->
                <el-form-item>
                    <el-button type="danger" @click="deleteChannel(index)" size="small" :disabled="channel.fixed">
                        <font-awesome-icon icon="trash-alt" />
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <div v-if="activeChannel === 'cfr2'">
            <el-form 
                v-for="(channel, index) in cfr2Settings.channels"
                :model="channel" 
                label-position="top"
                class="channel-form"
            >
                <el-form-item :label="$t('uploadChannel.channelName')">
                    <el-input v-model="channel.name" :disabled="channel.fixed"/>
                </el-form-item>
                <el-form-item :label="$t('uploadChannel.enableChannel')">
                    <el-switch v-model="channel.enabled"/>
                </el-form-item>
                <el-form-item>
                    <template #label>
                        {{ $t('uploadChannel.publicAccessUrl') }}
                        <el-tooltip :content="$t('uploadChannel.publicAccessUrlTip')" placement="top">
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-input v-model="channel.publicUrl"/>
                </el-form-item>
                <!-- 容量限制配置 -->
                <el-form-item>
                    <template #label>
                        {{ $t('uploadChannel.quotaLimit') }}
                        <el-tooltip :content="$t('uploadChannel.quotaLimitTip')" placement="top">
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-switch v-model="channel.quota.enabled" @change="(val) => onQuotaEnabledChange(val, channel)"/>
                </el-form-item>
                <el-form-item v-if="channel.quota.enabled" :label="$t('uploadChannel.quotaLimitGB')">
                    <el-input-number v-model="channel.quota.limitGB" :min="0.1" :step="1" :precision="1"/>
                </el-form-item>
                <el-form-item v-if="channel.quota.enabled">
                    <template #label>
                        {{ $t('uploadChannel.threshold') }}
                        <el-tooltip :content="$t('uploadChannel.thresholdTip')" placement="top">
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-input-number v-model="channel.quota.threshold" :min="50" :max="100" :step="5"/>
                </el-form-item>
                <!-- 容量使用情况显示 -->
                <el-form-item v-if="channel.quota.enabled && channel.name">
                    <template #label>
                        {{ $t('uploadChannel.currentUsage') }}
                        <el-button link type="primary" @click="refreshQuota" :loading="quotaLoading" style="margin-left: 8px;">
                            <font-awesome-icon icon="sync-alt" />
                        </el-button>
                    </template>
                    <div class="quota-status">
                        <el-progress 
                            :percentage="getQuotaPercentage(channel)" 
                            :status="getQuotaStatus(channel)"
                            :stroke-width="20"
                            :text-inside="true"
                            :format="() => getQuotaText(channel)"
                        />
                        <div class="quota-info" :class="{ 'quota-warning': isQuotaExceeded(channel) }">
                            {{ getQuotaStatusText(channel) }}
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <div v-if="activeChannel === 's3'">
            <!-- 负载均衡配置 -->
            <el-form 
                :model="s3Settings" 
                label-position="top"
                class="channel-form"
            >
                <el-form-item :label="$t('uploadChannel.loadBalance')">
                    <el-switch v-model="s3Settings.loadBalance.enabled"/>
                </el-form-item>
            </el-form>

            <el-form 
                v-for="(channel, index) in s3Settings.channels"
                :model="channel" 
                label-position="top"
                :rules = "s3Rules"
                ref = "s3ChannelForm"
                class="channel-form"
            >
                <el-form-item :label="$t('uploadChannel.channelName')" prop="name">
                    <el-input v-model="channel.name" :disabled="channel.fixed"/>
                </el-form-item>
                <el-form-item :label="$t('uploadChannel.enableChannel')" prop="enabled">
                    <el-switch v-model="channel.enabled"/>
                </el-form-item>
                <el-form-item prop="endpoint">
                    <template #label>
                        {{ $t('uploadChannel.endpoint') }}
                        <el-tooltip :content="$t('uploadChannel.endpointTip')" placement="top">
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-input v-model="channel.endpoint" :disabled="channel.fixed"/>
                </el-form-item>
                <el-form-item prop="pathStyle">
                    <template #label>
                        {{ $t('uploadChannel.pathStyle') }}
                        <el-tooltip :content="$t('uploadChannel.pathStyleTip')" placement="top" raw-content>
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-switch v-model="channel.pathStyle" :disabled="channel.fixed"/>
                </el-form-item>
                <el-form-item :label="$t('uploadChannel.bucketName')" prop="bucketName">
                    <el-input v-model="channel.bucketName" :disabled="channel.fixed"/>
                </el-form-item>
                <el-form-item :label="$t('uploadChannel.bucketRegion')" prop="region">
                    <el-input v-model="channel.region" :placeholder="$t('uploadChannel.regionPlaceholder')" :disabled="channel.fixed"/>
                </el-form-item>
                <el-form-item :label="$t('uploadChannel.accessKeyId')" prop="accessKeyId">
                    <el-input v-model="channel.accessKeyId" :disabled="channel.fixed" type="password" show-password autocomplete="new-password"/>
                </el-form-item>
                <el-form-item :label="$t('uploadChannel.secretAccessKey')" prop="secretAccessKey">
                    <el-input v-model="channel.secretAccessKey" :disabled="channel.fixed" type="password" show-password autocomplete="new-password"/>
                </el-form-item>
                <!-- 容量限制配置 -->
                <el-form-item>
                    <template #label>
                        {{ $t('uploadChannel.quotaLimit') }}
                        <el-tooltip :content="$t('uploadChannel.quotaLimitTip')" placement="top">
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-switch v-model="channel.quota.enabled" @change="(val) => onQuotaEnabledChange(val, channel)"/>
                </el-form-item>
                <el-form-item v-if="channel.quota.enabled" :label="$t('uploadChannel.quotaLimitGB')">
                    <el-input-number v-model="channel.quota.limitGB" :min="0.1" :step="1" :precision="1"/>
                </el-form-item>
                <el-form-item v-if="channel.quota.enabled">
                    <template #label>
                        {{ $t('uploadChannel.threshold') }}
                        <el-tooltip :content="$t('uploadChannel.thresholdTip')" placement="top">
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-input-number v-model="channel.quota.threshold" :min="50" :max="100" :step="5"/>
                </el-form-item>
                <!-- 容量使用情况显示 -->
                <el-form-item v-if="channel.quota.enabled && channel.name">
                    <template #label>
                        {{ $t('uploadChannel.currentUsage') }}
                        <el-button link type="primary" @click="refreshQuota" :loading="quotaLoading" style="margin-left: 8px;">
                            <font-awesome-icon icon="sync-alt" />
                        </el-button>
                    </template>
                    <div class="quota-status">
                        <el-progress 
                            :percentage="getQuotaPercentage(channel)" 
                            :status="getQuotaStatus(channel)"
                            :stroke-width="20"
                            :text-inside="true"
                            :format="() => getQuotaText(channel)"
                        />
                        <div class="quota-info" :class="{ 'quota-warning': isQuotaExceeded(channel) }">
                            {{ getQuotaStatusText(channel) }}
                        </div>
                    </div>
                </el-form-item>
                <!-- 删除 -->
                <el-form-item>
                    <el-button type="danger" @click="deleteChannel(index)" size="small" :disabled="channel.fixed">
                        <font-awesome-icon icon="trash-alt" />
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <div v-if="activeChannel === 'discord'">
            <!-- 负载均衡配置 -->
            <el-form 
                :model="discordSettings" 
                label-position="top"
                class="channel-form"
            >
                <el-form-item :label="$t('uploadChannel.loadBalance')">
                    <el-switch v-model="discordSettings.loadBalance.enabled"/>
                </el-form-item>
            </el-form>

            <el-form
                v-for="(channel, index) in discordSettings.channels"
                :key="index"
                :model="channel"
                label-position="top"
                :rules="discordRules"
                ref="discordChannelForm"
                class="channel-form"
            >
                <el-form-item :label="$t('uploadChannel.channelName')" prop="name">
                    <el-input v-model="channel.name" :disabled="channel.fixed"/>
                </el-form-item>
                <el-form-item :label="$t('uploadChannel.enableChannel')" prop="enabled">
                    <el-switch v-model="channel.enabled"/>
                </el-form-item>
                <el-form-item :label="$t('uploadChannel.botToken')" prop="botToken">
                    <el-input v-model="channel.botToken" :disabled="channel.fixed" type="password" show-password autocomplete="new-password"/>
                </el-form-item>
                <el-form-item :label="$t('uploadChannel.channelId')" prop="channelId">
                    <el-input v-model="channel.channelId" :disabled="channel.fixed" type="password" show-password autocomplete="new-password"/>
                </el-form-item>
                <el-form-item>
                    <template #label>
                        {{ $t('uploadChannel.proxyDomain') }}
                        <el-tooltip :content="$t('uploadChannel.proxyDomainTip')" placement="top">
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-input v-model="channel.proxyUrl" :placeholder="$t('uploadChannel.proxyDomainPlaceholder')"/>
                </el-form-item>
                <el-form-item>
                    <template #label>
                        {{ $t('uploadChannel.nitroMember') }}
                        <el-tooltip :content="$t('uploadChannel.nitroTip')" placement="top">
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-switch v-model="channel.isNitro"/>
                </el-form-item>
                <el-form-item>
                    <div class="discord-limit-tip">
                        <font-awesome-icon icon="info-circle" style="margin-right: 5px;"/>
                        {{ channel.isNitro ? $t('uploadChannel.nitroLimit') : $t('uploadChannel.freeLimit') }}
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="discord-rate-limit-tip">
                        <font-awesome-icon icon="exclamation-triangle" style="margin-right: 5px;"/>
                        {{ $t('uploadChannel.discordRateLimit') }}
                    </div>
                </el-form-item>
                <!-- 删除 -->
                <el-form-item>
                    <el-button type="danger" @click="deleteChannel(index)" size="small" :disabled="channel.fixed">
                        <font-awesome-icon icon="trash-alt" />
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <div v-if="activeChannel === 'huggingface'">
            <!-- 负载均衡配置 -->
            <el-form 
                :model="huggingfaceSettings" 
                label-position="top"
                class="channel-form"
            >
                <el-form-item :label="$t('uploadChannel.loadBalance')">
                    <el-switch v-model="huggingfaceSettings.loadBalance.enabled"/>
                </el-form-item>
            </el-form>

            <el-form
                v-for="(channel, index) in huggingfaceSettings.channels"
                :key="index"
                :model="channel"
                label-position="top"
                :rules="huggingfaceRules"
                ref="huggingfaceChannelForm"
                class="channel-form"
            >
                <el-form-item :label="$t('uploadChannel.channelName')" prop="name">
                    <el-input v-model="channel.name" :disabled="channel.fixed"/>
                </el-form-item>
                <el-form-item :label="$t('uploadChannel.enableChannel')" prop="enabled">
                    <el-switch v-model="channel.enabled"/>
                </el-form-item>
                <el-form-item prop="repo">
                    <template #label>
                        {{ $t('uploadChannel.repoName') }}
                        <el-tooltip :content="$t('uploadChannel.repoNameTip')" placement="top">
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-input v-model="channel.repo" :disabled="channel.fixed" :placeholder="$t('uploadChannel.repoNamePlaceholder')"/>
                </el-form-item>
                <el-form-item :label="$t('uploadChannel.accessToken')" prop="token">
                    <el-input v-model="channel.token" :disabled="channel.fixed" type="password" show-password autocomplete="new-password"/>
                </el-form-item>
                <el-form-item>
                    <template #label>
                        {{ $t('uploadChannel.privateRepo') }}
                        <el-tooltip :content="$t('uploadChannel.privateRepoTip')" placement="top">
                            <font-awesome-icon icon="question-circle" style="margin-left: 5px; cursor: pointer;"/>
                        </el-tooltip>
                    </template>
                    <el-switch v-model="channel.isPrivate"/>
                </el-form-item>
                <el-form-item>
                    <div class="huggingface-tip">
                        <font-awesome-icon icon="info-circle" style="margin-right: 5px;"/>
                        {{ channel.isPrivate ? $t('uploadChannel.privateRepoLimit') : $t('uploadChannel.publicRepoLimit') }}
                    </div>
                </el-form-item>
                <!-- 删除 -->
                <el-form-item>
                    <el-button type="danger" @click="deleteChannel(index)" size="small" :disabled="channel.fixed">
                        <font-awesome-icon icon="trash-alt" />
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        </div>

        <!-- 操作按钮 -->
        <div class="actions">
            <el-button type="primary" @click="addChannel">
                <font-awesome-icon icon="plus" />
            </el-button>
            <el-button type="primary" @click="saveSettings">{{ $t('uploadChannel.saveSettings') }}</el-button>
        </div>
    </div>
</template>

<script>
import fetchWithAuth from '@/utils/fetchWithAuth';

export default {
data() {
    return {
    // 一级设置：上传渠道
    channels: [
        { value: 'telegram', label: 'Telegram' },
        { value: 'cfr2', label: 'CloudFlare R2' },
        { value: 's3', label: 'S3' },
        { value: 'discord', label: 'Discord' },
        { value: 'huggingface', label: 'HuggingFace' }
    ],
    activeChannel: 'telegram', // 当前选中的上传渠道

    // 二级设置：Telegram 配置
    telegramSettings: {
        loadBalance: {},
        channels: []
    },

    tgRules: {
        name: [
            { required: true, message: this.$t('uploadChannel.channelNameRequired'), trigger: 'blur' },
            { validator: (rule, value, callback) => {
                const names = this.telegramSettings.channels.map((item) => item.name);
                if (names.filter((name) => name === value).length > 1) {
                    callback(new Error(this.$t('uploadChannel.channelNameDuplicate')));
                } else if (value === 'Telegram_env') {
                    const savePath = this.telegramSettings.channels.find((item) => item.name === value).savePath;
                    if (savePath !== 'environment variable') {
                        callback(new Error(this.$t('uploadChannel.channelNameReserved')));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            }, trigger: 'blur' }
        ],
        botToken: [
            { required: true, message: this.$t('uploadChannel.botTokenRequired'), trigger: 'blur' }
        ],
        chatId: [
            { required: true, message: this.$t('uploadChannel.chatIdRequired'), trigger: 'blur' }
        ]
    },

    // 二级设置：CFR2 配置
    cfr2Settings: {
        channels: []
    },

    // 二级设置：S3 配置
    s3Settings: {
        loadBalance: {},
        channels: []
    },

    // 二级设置：Discord 配置
    discordSettings: {
        loadBalance: {},
        channels: []
    },

    // 二级设置：HuggingFace 配置
    huggingfaceSettings: {
        loadBalance: {},
        channels: []
    },

    huggingfaceRules: {
        name: [
            { required: true, message: this.$t('uploadChannel.channelNameRequired'), trigger: 'blur' },
            { validator: (rule, value, callback) => {
                const names = this.huggingfaceSettings.channels.map((item) => item.name);
                if (names.filter((name) => name === value).length > 1) {
                    callback(new Error(this.$t('uploadChannel.channelNameDuplicate')));
                } else if (value === 'HuggingFace_env') {
                    const savePath = this.huggingfaceSettings.channels.find((item) => item.name === value).savePath;
                    if (savePath !== 'environment variable') {
                        callback(new Error(this.$t('uploadChannel.channelNameReserved')));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            }, trigger: 'blur' }
        ],
        token: [
            { required: true, message: this.$t('uploadChannel.accessTokenRequired'), trigger: 'blur' }
        ],
        repo: [
            { required: true, message: this.$t('uploadChannel.repoNameRequired'), trigger: 'blur' }
        ]
    },

    discordRules: {
        name: [
            { required: true, message: this.$t('uploadChannel.channelNameRequired'), trigger: 'blur' },
            { validator: (rule, value, callback) => {
                const names = this.discordSettings.channels.map((item) => item.name);
                if (names.filter((name) => name === value).length > 1) {
                    callback(new Error(this.$t('uploadChannel.channelNameDuplicate')));
                } else if (value === 'Discord_env') {
                    const savePath = this.discordSettings.channels.find((item) => item.name === value).savePath;
                    if (savePath !== 'environment variable') {
                        callback(new Error(this.$t('uploadChannel.channelNameReserved')));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            }, trigger: 'blur' }
        ],
        botToken: [
            { required: true, message: this.$t('uploadChannel.botTokenRequired'), trigger: 'blur' }
        ],
        channelId: [
            { required: true, message: this.$t('uploadChannel.channelIdRequired'), trigger: 'blur' }
        ]
    },

    // 容量统计数据
    quotaStats: {},
    quotaLoading: false,

    s3Rules: {
        name: [
            { required: true, message: this.$t('uploadChannel.channelNameRequired'), trigger: 'blur' },
            { validator: (rule, value, callback) => {
                const names = this.s3Settings.channels.map((item) => item.name);
                if (names.filter((name) => name === value).length > 1) {
                    callback(new Error(this.$t('uploadChannel.channelNameDuplicate')));
                } else if (value === 'S3_env') {
                    const savePath = this.s3Settings.channels.find((item) => item.name === value).savePath;
                    if (savePath !== 'environment variable') {   
                        callback(new Error(this.$t('uploadChannel.channelNameReserved')));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            }, trigger: 'blur' }
        ],
        endpoint: [
            { required: true, message: this.$t('uploadChannel.endpointRequired'), trigger: 'blur' }
        ],
        bucketName: [
            { required: true, message: this.$t('uploadChannel.bucketNameRequired'), trigger: 'blur' }
        ],
        region: [
            { required: true, message: this.$t('uploadChannel.regionRequired'), trigger: 'blur' }
        ],
        accessKeyId: [
            { required: true, message: this.$t('uploadChannel.accessKeyIdRequired'), trigger: 'blur' }
        ],
        secretAccessKey: [
            { required: true, message: this.$t('uploadChannel.secretAccessKeyRequired'), trigger: 'blur' }
        ]
    },

    // 加载状态
    loading: false

    };
},
computed: {
    // 当前选中渠道的标签
    activeChannelLabel() {
        const channel = this.channels.find(
            (item) => item.value === this.activeChannel
        );
        return channel ? channel.label : '';
    }
},
methods: {
    addChannel() {
        switch (this.activeChannel) {
            case 'telegram':
                this.telegramSettings.channels.push({
                    id: this.telegramSettings.channels.length + 1,
                    name: '',
                    type: 'telegram',
                    savePath: 'database',
                    botToken: '',
                    chatId: '',
                    enabled: true,
                    fixed: false
                });
                break;
            case 'cfr2':
                this.$message.error(this.$t('uploadChannel.r2AddTip'));
                break;
            case 's3':
                this.s3Settings.channels.push({
                    id: this.s3Settings.channels.length + 1,
                    name: '',
                    type: 's3',
                    savePath: 'database',
                    accessKeyId: '',
                    secretAccessKey: '',
                    region: '',
                    bucketName: '',
                    endpoint: '',
                    pathStyle: false,
                    enabled: true,
                    fixed: false,
                    quota: {
                        enabled: false,
                        limitGB: 10,
                        threshold: 95
                    }
                });
                break;
            case 'discord':
                this.discordSettings.channels.push({
                    id: this.discordSettings.channels.length + 1,
                    name: '',
                    type: 'discord',
                    savePath: 'database',
                    botToken: '',
                    channelId: '',
                    proxyUrl: '',
                    isNitro: false,
                    enabled: true,
                    fixed: false
                });
                break;
            case 'huggingface':
                this.huggingfaceSettings.channels.push({
                    id: this.huggingfaceSettings.channels.length + 1,
                    name: '',
                    type: 'huggingface',
                    savePath: 'database',
                    token: '',
                    repo: '',
                    isPrivate: false,
                    enabled: true,
                    fixed: false
                });
                break;
        }
    },
    deleteChannel(index) {
        switch (this.activeChannel) {
            case 'telegram':
                this.telegramSettings.channels.forEach((item, i) => {
                    if (i > index) {
                        item.id -= 1;
                    }
                });
                this.telegramSettings.channels.splice(index, 1);
                break;
            case 'cfr2':
                this.cfr2Settings.channels.forEach((item, i) => {
                    if (i > index) {
                        item.id -= 1;
                    }
                });
                this.cfr2Settings.channels.splice(index, 1);
                break;
            case 's3':
                this.s3Settings.channels.forEach((item, i) => {
                    if (i > index) {
                        item.id -= 1;
                    }
                });
                this.s3Settings.channels.splice(index, 1);
                break;
            case 'discord':
                this.discordSettings.channels.forEach((item, i) => {
                    if (i > index) {
                        item.id -= 1;
                    }
                });
                this.discordSettings.channels.splice(index, 1);
                break;
            case 'huggingface':
                this.huggingfaceSettings.channels.forEach((item, i) => {
                    if (i > index) {
                        item.id -= 1;
                    }
                });
                this.huggingfaceSettings.channels.splice(index, 1);
                break;
        }
    },
    saveSettings() {
        let validationPromises = [];

        if (this.$refs.tgChannelForm) {
            this.$refs.tgChannelForm.forEach((form) => {
                validationPromises.push(new Promise((resolve) => {
                    form.validate((valid) => resolve(valid));
                }));
            });
        }

        if (this.$refs.s3ChannelForm) {
            this.$refs.s3ChannelForm.forEach((form) => {
                validationPromises.push(new Promise((resolve) => {
                    form.validate((valid) => resolve(valid));
                }));
            });
        }

        if (this.$refs.discordChannelForm) {
            this.$refs.discordChannelForm.forEach((form) => {
                validationPromises.push(new Promise((resolve) => {
                    form.validate((valid) => resolve(valid));
                }));
            });
        }

        if (this.$refs.huggingfaceChannelForm) {
            this.$refs.huggingfaceChannelForm.forEach((form) => {
                validationPromises.push(new Promise((resolve) => {
                    form.validate((valid) => resolve(valid));
                }));
            });
        }

        Promise.all(validationPromises).then((results) => {
            const isValid = results.every(valid => valid);

            if (!isValid) {
                return;
            }

            const settings = {
                telegram: this.telegramSettings,
                cfr2: this.cfr2Settings,
                s3: this.s3Settings,
                discord: this.discordSettings,
                huggingface: this.huggingfaceSettings
            };
            fetchWithAuth('/api/manage/sysConfig/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            })
            .then(() => {
                this.$message.success(this.$t('message.settingsSaved'));
            });
        });
    },
    async refreshQuota() {
        this.quotaLoading = true;
        try {
            const response = await fetchWithAuth('/api/manage/quota', {
                method: 'POST'
            });
            const data = await response.json();
            if (data.success) {
                this.quotaStats = data.channelStats || {};
            } else {
                const getResponse = await fetchWithAuth('/api/manage/quota');
                const getData = await getResponse.json();
                if (getData.success) {
                    this.quotaStats = getData.quotaStats || {};
                }
            }
        } catch (error) {
            console.error('Failed to refresh quota stats:', error);
        } finally {
            this.quotaLoading = false;
        }
    },
    async loadQuotaStats() {
        try {
            const response = await fetchWithAuth('/api/manage/quota');
            const data = await response.json();
            if (data.success) {
                this.quotaStats = data.quotaStats || {};
            }
        } catch (error) {
            console.error('Failed to load quota stats:', error);
        }
    },
    getChannelUsedGB(channel) {
        const stats = this.quotaStats[channel.name];
        if (!stats) return 0;
        return (stats.usedMB || 0) / 1024;
    },
    getQuotaPercentage(channel) {
        const usedGB = this.getChannelUsedGB(channel);
        const limitGB = channel.quota?.limitGB || 10;
        const percentage = (usedGB / limitGB) * 100;
        return Math.min(100, Math.round(percentage * 10) / 10);
    },
    getQuotaStatus(channel) {
        const percentage = this.getQuotaPercentage(channel);
        const threshold = channel.quota?.threshold || 95;
        if (percentage >= threshold) return 'exception';
        if (percentage >= 80) return 'warning';
        return 'success';
    },
    getQuotaText(channel) {
        const usedGB = this.getChannelUsedGB(channel);
        const limitGB = channel.quota?.limitGB || 10;
        return `${this.$t('uploadChannel.quotaUsed')} ${usedGB.toFixed(2)} ${this.$t('uploadChannel.quotaOf')} ${limitGB} GB`;
    },
    isQuotaExceeded(channel) {
        const percentage = this.getQuotaPercentage(channel);
        const threshold = channel.quota?.threshold || 95;
        return percentage >= threshold;
    },
    getQuotaStatusText(channel) {
        const percentage = this.getQuotaPercentage(channel);
        const threshold = channel.quota?.threshold || 95;
        if (percentage >= threshold) {
            return `⚠️ ${this.$t('uploadChannel.quotaStatusExceeded')} (${threshold}%)`;
        }
        if (percentage >= 80) {
            return `⚡ ${this.$t('uploadChannel.quotaStatusWarning')}`;
        }
        return `✓ ${this.$t('uploadChannel.quotaStatusNormal')}`;
    },
    async onQuotaEnabledChange(enabled, channel) {
        if (enabled && channel.name) {
            const stats = this.quotaStats[channel.name];
            if (!stats) {
                this.$confirm(
                    this.$t('message.quotaInitConfirm'),
                    this.$t('message.quotaInitTitle'),
                    {
                        confirmButtonText: this.$t('message.quotaInitNow'),
                        cancelButtonText: this.$t('message.quotaInitLater'),
                        type: 'info'
                    }
                ).then(async () => {
                    await this.recalculateQuota();
                }).catch(() => {
                    this.$message.info(this.$t('message.quotaInitLaterTip'));
                });
            }
        }
    },
    async recalculateQuota() {
        this.quotaLoading = true;
        try {
            this.$message.info(this.$t('message.quotaCalculating'));
            const response = await fetchWithAuth('/api/manage/quota', {
                method: 'POST'
            });
            const data = await response.json();
            if (data.success) {
                this.quotaStats = data.channelStats || {};
                this.$message.success(this.$t('message.quotaCalculateSuccess'));
            } else {
                this.$message.error(this.$t('message.quotaCalculateFailed') + ': ' + (data.error || ''));
            }
        } catch (error) {
            console.error('Failed to recalculate quota:', error);
            this.$message.error(this.$t('message.quotaCalculateFailed'));
        } finally {
            this.quotaLoading = false;
        }
    }

},
mounted() {
    this.loading = true;
    fetchWithAuth('/api/manage/sysConfig/upload')
    .then((response) => response.json())
    .then((data) => {
        this.telegramSettings = data.telegram;
        if (data.cfr2 && data.cfr2.channels) {
            data.cfr2.channels = data.cfr2.channels.map(channel => ({
                ...channel,
                quota: channel.quota || { enabled: false, limitGB: 10, threshold: 95 }
            }));
        }
        this.cfr2Settings = data.cfr2;
        if (data.s3 && data.s3.channels) {
            data.s3.channels = data.s3.channels.map(channel => ({
                ...channel,
                quota: channel.quota || { enabled: false, limitGB: 10, threshold: 95 }
            }));
        }
        this.s3Settings = data.s3;
        if (data.discord && data.discord.channels) {
            data.discord.channels = data.discord.channels.map(channel => ({
                ...channel,
                proxyUrl: channel.proxyUrl || ''
            }));
        }
        this.discordSettings = data.discord || { loadBalance: {}, channels: [] };
        if (data.huggingface && data.huggingface.channels) {
            data.huggingface.channels = data.huggingface.channels.map(channel => ({
                ...channel,
                isPrivate: channel.isPrivate || false
            }));
        }
        this.huggingfaceSettings = data.huggingface || { loadBalance: {}, channels: [] };
        this.loadQuotaStats();
    })
    .finally(() => {
        this.loading = false;
    });
}
};
</script>

<style scoped>
.upload-settings {
    padding: 20px;
    min-height: 500px;
}

.upload-channel {
    margin-bottom: 40px;
}

.first-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
}

.upload-channel :deep(.el-radio-group) {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.upload-channel :deep(.el-radio) {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 10px;
    background: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color-lighter);
    transition: all 0.25s ease;
    margin-right: 0;
    height: auto;
}

.upload-channel :deep(.el-radio:hover) {
    border-color: var(--el-color-primary-light-5);
    background: var(--el-fill-color);
}

.upload-channel :deep(.el-radio.is-checked) {
    background: linear-gradient(135deg, rgba(64, 158, 255, 0.15) 0%, rgba(56, 189, 248, 0.1) 100%);
    border-color: var(--el-color-primary);
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.upload-channel :deep(.el-radio__input) {
    display: none;
}

.upload-channel :deep(.el-radio__label) {
    padding-left: 0;
    font-weight: 500;
    font-size: 14px;
}

.second-title {
    text-align: start;
    margin-left: 0;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--el-border-color-lighter);
}

.channel-settings {
    margin-top: 20px;
}

.channel-form {
    margin-bottom: 30px;
    padding: 20px;
    background: var(--el-fill-color-lighter);
    border-radius: 12px;
    border: 1px solid var(--el-border-color-lighter);
}

.channel-form :deep(.el-form-item) {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.channel-form :deep(.el-form-item__label) {
    text-align: left;
    padding-bottom: 8px;
    font-weight: 500;
    color: var(--el-text-color-primary);
}

.channel-form :deep(.el-form-item__content) {
    width: 100%;
    max-width: 400px;
}

.channel-form :deep(.el-input) {
    width: 100%;
}

.channel-form :deep(.el-switch) {
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

.quota-status {
    width: 100%;
    max-width: 400px;
}

.quota-status :deep(.el-progress) {
    margin-bottom: 8px;
}

.quota-status :deep(.el-progress-bar__inner) {
    transition: width 0.5s ease;
}

.quota-info {
    font-size: 13px;
    color: var(--el-text-color-secondary);
    padding: 8px 12px;
    background: var(--el-fill-color);
    border-radius: 6px;
}

.quota-info.quota-warning {
    color: var(--el-color-danger);
    background: var(--el-color-danger-light-9);
    font-weight: 500;
}

.discord-limit-tip {
    font-size: 13px;
    color: var(--el-color-info);
    padding: 10px 14px;
    background: var(--el-color-info-light-9);
    border-radius: 6px;
    border-left: 3px solid var(--el-color-info);
}

.discord-rate-limit-tip {
    font-size: 13px;
    color: var(--el-color-warning);
    padding: 10px 14px;
    background: var(--el-color-warning-light-9);
    border-radius: 6px;
    border-left: 3px solid var(--el-color-warning);
}

.huggingface-tip {
    font-size: 13px;
    color: var(--el-color-info);
    padding: 10px 14px;
    background: var(--el-color-info-light-9);
    border-radius: 6px;
    border-left: 3px solid var(--el-color-info);
    white-space: nowrap;
}

@media (max-width: 768px) {
    .upload-settings {
        padding: 15px;
    }
    
    .upload-channel :deep(.el-radio-group) {
        gap: 8px;
    }
    
    .upload-channel :deep(.el-radio) {
        padding: 8px 14px;
        font-size: 13px;
    }
    
    .channel-form {
        padding: 15px;
    }
    
    .channel-form :deep(.el-form-item__content) {
        max-width: 100%;
    }

    .quota-status {
        max-width: 100%;
    }
}
</style>