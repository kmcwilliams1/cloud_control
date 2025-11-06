
export type InstanceSummary = {
  instanceId: string;
  instanceName?: string;
  state: 'running' | 'stopped' | 'pending' | string;
  publicIpv4?: string;
  privateIpv4?: string;
  publicDns?: string;
  privateIpDnsName?: string;
  hostnameType?: string;
  instanceType?: string;
  vpcId?: string;
  subnetId?: string;
  autoAssignedIp?: string;
  iamRole?: string | null;
  imdsv2?: string;
  elasticIp?: string | null;
  autoScalingGroupName?: string | null;
};

export const screenshot54: InstanceSummary = {
  instanceId: 'i-08ad0ac2f01802673',
  instanceName: 'test-demo-ec2-instance',
  state: 'running',
  publicIpv4: '54.162.107.212',
  privateIpv4: '172.31.45.3',
  publicDns: 'ec2-54-162-107-212.compute-1.amazonaws.com',
  privateIpDnsName: 'ip-172-31-45-3.ec2.internal',
  hostnameType: 'IP name: ip-172-31-45-3.ec2.internal',
  instanceType: 't2.micro',
  vpcId: 'vpc-8e159af3',
  subnetId: 'subnet-ed8af5b2',
  autoAssignedIp: '54.162.107.212 (Public IP)',
  iamRole: null,
  imdsv2: 'Optional',
  elasticIp: null,
  autoScalingGroupName: null,
};