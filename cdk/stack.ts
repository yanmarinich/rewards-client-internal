import { Stack, RemovalPolicy } from 'aws-cdk-lib';
import { HostedZone, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { BlockPublicAccess, Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
    CloudFrontWebDistribution,
    ViewerCertificate,
    SecurityPolicyProtocol,
    SSLMethod,
} from 'aws-cdk-lib/aws-cloudfront';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from "constructs";

const DOMAINS = {
    production: "network.connect.thrivecoin.com",
    staging: "network-connect.staging.thrivecoin.com",
    pr: "network-connect-pr-##.staging.thrivecoin.com"
}

const HOSTED_ZONES = {
    production: "connect.thrivecoin.com",
    staging: "staging.thrivecoin.com"
}

export class AppStack extends Stack {
    constructor(scope: Construct, id: string, environment: string = "staging", pull_request: string = "") {
        super(scope, id, {
            env: {
                account: process.env.CDK_DEFAULT_ACCOUNT,
                region: process.env.CDK_DEFAULT_REGION
            }
        });

        const isPR = !!pull_request;
        const recordDomainName = isPR ? DOMAINS.pr.replace("##", pull_request) : DOMAINS[environment]
        const domainName = HOSTED_ZONES[environment];

        // Get The Hosted Zone
        const zone = HostedZone.fromLookup(this, "Zone", {
            domainName
        });

        // Create S3 Bucket for our app
        const siteBucket = new Bucket(this, "Bucket", {
            bucketName: recordDomainName,
            websiteIndexDocument: "index.html",
            publicReadAccess: true,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: new BlockPublicAccess({
                blockPublicAcls: false,
                ignorePublicAcls: false,
                blockPublicPolicy: false,
                restrictPublicBuckets: false
            })
        })

        // Create Certificate
        const siteCertificate = new DnsValidatedCertificate(this, "SiteCertificate", {
            domainName: recordDomainName,
            hostedZone: zone,
            region: "us-east-1"
        });

        // Create CloudFront Distribution
        const siteDistribution = new CloudFrontWebDistribution(this, "SiteDistribution", {
            viewerCertificate: ViewerCertificate.fromAcmCertificate(siteCertificate, {
                aliases: [recordDomainName],
                securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2021,
                sslMethod: SSLMethod.SNI
            }),
            originConfigs: [{
                s3OriginSource: {
                    s3BucketSource: siteBucket,
                },
                behaviors: [{
                    isDefaultBehavior: true
                }]
            }],
            errorConfigurations: [
                {
                    errorCode: 403,
                    errorCachingMinTtl: 30,
                    responseCode: 200,
                    responsePagePath: "/index.html"
                }, {
                    errorCode: 404,
                    errorCachingMinTtl: 30,
                    responseCode: 200,
                    responsePagePath: "/index.html"
                }
            ]
        });

        // Create A Record Custom Domain to CloudFront CDN
        new ARecord(this, "SiteRecord", {
            recordName: recordDomainName,
            target: RecordTarget.fromAlias(new CloudFrontTarget(siteDistribution)),
            zone
        });

        // Deploy site to S3
        new BucketDeployment(this, "Deployment", {
            sources: [Source.asset("./build")],
            destinationBucket: siteBucket as IBucket,
            distribution: siteDistribution,
            distributionPaths: ["/*"]
        });
    }
}