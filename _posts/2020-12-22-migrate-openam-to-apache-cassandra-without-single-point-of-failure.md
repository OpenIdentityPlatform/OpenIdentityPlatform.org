---
layout: home
title: "Migrate OpenAM to Apache Cassandra without a Single Point of Failure"
landing-title2: "Migrate OpenAM to Apache Cassandra without a Single Point of Failure"
description: "How to plan data storages and data centers resources for OpenAM fault tolerance"
keywords: 'OpenAM, Apache Cassandra, Data Center, Fault Tolerance'
imageurl: 'openam-og.png'
share-buttons: true
products: 
- openam

---
<h1>Migrate OpenAM to Apache Cassandra without a Single Point of Failure</h1>

Original article: [https://github.com/OpenIdentityPlatform/OpenAM/wiki/Migrate-OpenAM-to-Apache-Cassandra-without-Single-Point-of-Failure](https://github.com/OpenIdentityPlatform/OpenAM/wiki/Migrate-OpenAM-to-Apache-Cassandra-without-Single-Point-of-Failure)

<h1>Initial Data Storage Scheme</h1>
<table>
<tbody>
<tr>
<th>Data Type</th>
<th>Storage Method</th>
<th>Fautl Tolerance Method</th>
<th colspan="1">Disadvantages</th></tr>
<tr>
<td>OpenAM configuration</td>
<td rowspan="3">OpenDJ (localhost:1389)</td>
<td rowspan="3">Multi-master replication<span>&nbsp;</span></td>
<td colspan="1">Configuration update on a single node affects all nodes by replication.</td></tr>
<tr>
<td>CTS-Core Token Service (Session persistence)</td>
<td rowspan="2">
<p>Syncronisation payload processed on all nodes</p>
<p>Read performance from single node restricted by single node performance.</p>
<p>Replication failure could cause other nodes to read-only mode</p></td></tr>
<tr>
<td>Accounts repository (except AD)</td></tr></tbody></table>

<h1>Data Storage Scheme for the Number of Credentials &gt;5 Million</h1>
<table>
<tbody>
<tr>
<th>Data Type</th>
<th>Storage Method</th>
<th>Fault Tolerance Method</th>
<th colspan="1">Disadvantages</th></tr>
<tr>
<td>OpenAM configuration</td>
<td>OpenDJ (localhost:1389)</td>
<td>Local independent storage as a part of the distribution (war file)</td>
<td colspan="1">Updating the configuration on one node does not affect other nodes (the nodes are completely independent)</td></tr>
<tr>
<td>CTS-Core Token Service (Session persistence)</td>
<td rowspan="2">Cassandra Cluster (tcp:9042)</td>
<td rowspan="2">Cluster without a single point of failure with geo-distribution and distribution by rack</td>
<td rowspan="2">
<p>Synchronization write payload is processed only on the nodes with the required replication level</p>
<p>The reading load from one node is not limited to the performance of one node, but distributed according to the replication level.</p>
<p>Node failure does cause replication stop according to the replication level</p></td></tr>
<tr>
<td>Accounts repository (except AD)</td></tr></tbody></table>

<h2>Migration Plan</h2>
<ol>
<li>Cluster hardware resources planning</li>
<li>Deploy the cluster according to the required level of fault tolerance</li>
<li>Provide network access OpenAM-&gt; tcp:9042</li>
<li>Migration stages (can be done independently):
<ol>
<li><span>Switch &quot;CTS - Core Token Service (sessions)&quot;</span></li>
<li><span><span>Switch &quot;Accounts repository (except AD)&quot; with legacy data migration</span></span></li>
<li><span><span><span>Switch &quot;OpenAM configuration&quot;</span></span></span></li></ol></li></ol>

<h2>Fault Tolerance Level Planning</h2>
<h3>Datacenter</h3>
<p>Defines geo-distributed storage fault tolerance. &nbsp;</p>
<ul>
<li>Minimum number of data centers: 1</li>
<li>The recommended number of data centers:&nbsp;
<ul>
<li>at least two&nbsp;</li>
<li>at least the same number of data centers used for application servers (OpenAM)</li></ul></li>
<li>Allowed data center fault tolerance mode:
<ul>
<li>Hot Spare: used for data processing&nbsp;for application servers (OpenAM)</li>
<li>Cold Spare: not used for data processing&nbsp;for application servers (OpenAM)</li></ul></li></ul>

<h3>Rack</h3>
<p>Minimum fault tolerance unit within a data center for data distribution within a data center, haves:</p>
<ul>
<li>Independent disk subsystem array</li>
<li>Independent virtualization hypervisor (host system)</li></ul>
<p>Amount calculation:</p>
<ul>
<li>Minimum quantity inside hot spare data center: 1, but not less than replication level inside the data center</li>
<li>Minimum quantity inside cold spare datacenter: 1, but not less than replication level inside the datacenter</li></ul>
<h3>Node</h3>
<div>Defines the unit of information storage and load inside the data center rack</div>

<h2>An Example of a Recommended Minimum Configuration</h2>
<h3>Test</h3>
<table>
<tbody>
<tr>
<th>DataCenter</th>
<th colspan="1">Type</th>
<th colspan="1">Amount of Copies</th>
<th>Rack</th>
<th colspan="1">% data</th>
<th>Node</th>
<th colspan="1">% data</th></tr>
<tr>
<td>dc01</td>
<td colspan="1">host</td>
<td colspan="1">1</td>
<td>rack01</td>
<td colspan="1">100%</td>
<td>dc01-rack01-node01</td>
<td colspan="1">100%</td></tr></tbody></table>

<h3>Production</h3>
<table>
<tbody>
<tr>
<th>DataCenter</th>
<th colspan="1">Type</th>
<th colspan="1">Amount of Copies</th>
<th>Rack</th>
<th colspan="1">data %</th>
<th>Node</th>
<th colspan="1"><span>data %</span></th></tr>
<tr>
<td>dc01</td>
<td colspan="1">hot</td>
<td colspan="1">1</td>
<td>rack01</td>
<td colspan="1" style="text-align: center;">100%</td>
<td><span>dc01-rack01-</span>node01</td>
<td colspan="1" style="text-align: center;">50%</td></tr>
<tr>
<td colspan="1">&nbsp;</td>
<td colspan="1">&nbsp;</td>
<td colspan="1">&nbsp;</td>
<td colspan="1">&nbsp;</td>
<td colspan="1" style="text-align: center;">&nbsp;</td>
<td colspan="1"><span>dc01-rack01-</span><span>node02</span></td>
<td colspan="1" style="text-align: center;"><span>50%</span></td></tr>
<tr>
<td>&nbsp;</td>
<td colspan="1">&nbsp;</td>
<td colspan="1">1</td>
<td><span>rack02</span></td>
<td colspan="1" style="text-align: center;"><span>100%</span></td>
<td><span>dc01-rack02-</span><span>node01</span></td>
<td colspan="1" style="text-align: center;"><span>50%</span></td></tr>
<tr>
<td colspan="1">&nbsp;</td>
<td colspan="1">&nbsp;</td>
<td colspan="1">&nbsp;</td>
<td colspan="1">&nbsp;</td>
<td colspan="1" style="text-align: center;">&nbsp;</td>
<td colspan="1"><span>dc01-rack02-</span><span>node02</span></td>
<td colspan="1" style="text-align: center;"><span>50%</span></td></tr>
<tr>
<td><span>dc02</span></td>
<td colspan="1"><span>hot</span></td>
<td colspan="1">1</td>
<td><span>rack01</span></td>
<td colspan="1" style="text-align: center;"><span>100%</span></td>
<td><span>dc02-rack01-</span><span>node01</span></td>
<td colspan="1" style="text-align: center;"><span>50%</span></td></tr>
<tr>
<td colspan="1">&nbsp;</td>
<td colspan="1">&nbsp;</td>
<td colspan="1">&nbsp;</td>
<td colspan="1">&nbsp;</td>
<td colspan="1" style="text-align: center;">&nbsp;</td>
<td colspan="1"><span>dc02-rack01-</span><span>node02</span></td>
<td colspan="1" style="text-align: center;"><span>50%</span></td></tr>
<tr>
<td>&nbsp;</td>
<td colspan="1">&nbsp;</td>
<td colspan="1">1</td>
<td><span>rack02</span></td>
<td colspan="1" style="text-align: center;"><span>100%</span></td>
<td><span>dc02-rack02-</span><span>node01</span></td>
<td colspan="1" style="text-align: center;"><span>50%</span></td></tr>
<tr>
<td colspan="1">&nbsp;</td>
<td colspan="1">&nbsp;</td>
<td colspan="1">&nbsp;</td>
<td colspan="1">&nbsp;</td>
<td colspan="1" style="text-align: center;">&nbsp;</td>
<td colspan="1"><span>dc02-rack02-</span><span>node02</span></td>
<td colspan="1" style="text-align: center;"><span>50%</span></td></tr></tbody></table>
<p>&nbsp;</p>
<p>Allowed:</p>
<ul>
<li>Increase the data center amount without service interruption</li>
<li>Increase the rack amount  without service interruption</li>
<li>Increase the node amount  without service interruption</li>
<li>Change the number of data copies inside the data center without service interruption</li></ul>

<h2>Hardware Requirements For a Single Node</h2>
<table>
<tbody>
<tr>
<th colspan="1">Environment</th>
<th>CPU</th>
<th>RAM</th>
<th>Disk</th></tr>
<tr>
<td colspan="1">Test</td>
<td>&gt;=2</td>
<td>&gt;=8</td>
<td>16G HDD</td></tr>
<tr>
<td colspan="1">Production</td>
<td>&gt;=8</td>
<td>&gt;=32 ballon=off</td>
<td>64G SSD RAID</td></tr></tbody></table>
