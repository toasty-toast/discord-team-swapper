import React from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { Guild, GuildMember, VoiceChannel, VoiceChannelMembers } from '../models';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

import './SwapConfigurator.css';

enum Team {
  Team1,
  Team2,
  None
}

interface GuildMemberWithTeam extends GuildMember {
  team: Team;
}

const SwapConfigurator: React.FC = () => {
  const getApiUrlBase = (): string => {
    const getUrl = window.location;
    return `${getUrl.protocol}//${getUrl.host}`;
  };

  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<Guild>();

  useEffect(() => {
    const loadGuilds = async () => {
      const response = await axios.get<Guild[]>(`${getApiUrlBase()}/guilds`);
      response.data?.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      setGuilds(response.data);
      setSelectedGuild(response.data.length > 0 ? response.data[0] : undefined);
    };

    loadGuilds();
  }, []);

  const [voiceChannels, setVoiceChannels] = useState<VoiceChannel[]>([]);
  const [team1VoiceChannel, setTeam1VoiceChannel] = useState<VoiceChannel>();
  const [team2VoiceChannel, setTeam2VoiceChannel] = useState<VoiceChannel>();

  const loadVoiceChannels = async () => {
    if (!selectedGuild) {
      return;
    }

    const response = await axios.get<VoiceChannel[]>(`${getApiUrlBase()}/guilds/${selectedGuild.id}/voice-channels`);
    setVoiceChannels(response.data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
    setTeam1VoiceChannel(response.data.length > 0 ? response.data[0] : undefined);
    setTeam2VoiceChannel(response.data.length > 0 ? response.data[0] : undefined);
  };

  const [members, setMembers] = useState<GuildMemberWithTeam[]>([]);

  const loadMembers = async () => {
    if (!selectedGuild) {
      return;
    }

    const response = await axios.get<GuildMember[]>(`${getApiUrlBase()}/guilds/${selectedGuild.id}/members`);
    setMembers(response.data.map(m => {
      return {
        ...m,
        team: Team.None
      }
    }).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
  };

  const setMemberTeam = (memberIndex: number, team: Team) => {
    const newMembers = members.slice();
    newMembers[memberIndex] = {
      ...newMembers[memberIndex],
      team: team
    };
    newMembers.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    newMembers.sort((a, b) => a.team - b.team);
    setMembers(newMembers);
  }

  useEffect(() => {
    loadVoiceChannels();
    loadMembers();
  }, [guilds, selectedGuild]);

  const sendMembersToChannels = async () => {
    const team1: VoiceChannelMembers = {
      id: team1VoiceChannel!.id,
      memberIds: members.filter(m => m.team === Team.Team1).map(m => m.id)
    };
    const team2: VoiceChannelMembers = {
      id: team2VoiceChannel!.id,
      memberIds: members.filter(m => m.team === Team.Team2).map(m => m.id)
    };
    await axios.post(`${getApiUrlBase()}/guilds/${selectedGuild!.id}/send-members-to-channels`, [team1, team2]);
  };

  const sendMembersToTeam1Channel = async () => {
    const target: VoiceChannelMembers = {
      id: team1VoiceChannel!.id,
      memberIds: members.filter(m => m.team !== Team.None).map(m => m.id)
    };
    await axios.post(`${getApiUrlBase()}/guilds/${selectedGuild!.id}/send-members-to-channels`, [target]);
  };

  const sendMembersToTeam2Channel = async () => {
    const target: VoiceChannelMembers = {
      id: team2VoiceChannel!.id,
      memberIds: members.filter(m => m.team !== Team.None).map(m => m.id)
    };
    await axios.post(`${getApiUrlBase()}/guilds/${selectedGuild!.id}/send-members-to-channels`, [target]);
  };

  return (
    <Form>
      <Row>
        <Form.Group controlId="formGroupServer">
          <Form.Label>Server</Form.Label>
          <Form.Select onChange={e => setSelectedGuild(guilds[e.currentTarget.selectedIndex])}>
            {
              guilds.map((guild: Guild, index: number) => (
                <option value={index} key={index}>{guild.name}</option>
              ))
            }
          </Form.Select>
        </Form.Group>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Team 1 Channel</Form.Label>
          <Form.Select onChange={e => setTeam1VoiceChannel(voiceChannels[e.currentTarget.selectedIndex])}>
            {
              voiceChannels.map((voiceChannel: VoiceChannel, index: number) => (
                <option value={index} key={index}>{voiceChannel.name}</option>
              ))
            }
          </Form.Select>
        </Col>
        <Col>
          <Form.Label>Team 2 Channel</Form.Label>
          <Form.Select onChange={e => setTeam2VoiceChannel(voiceChannels[e.currentTarget.selectedIndex])}>
            {
              voiceChannels.map((voiceChannel: VoiceChannel, index: number) => (
                <option value={index} key={index}>{voiceChannel.name}</option>
              ))
            }
          </Form.Select>
        </Col>
      </Row>
      <Row className="mt-3">
        <Form.Label>Teams</Form.Label>
        <Table className="members-table">
          <thead>
            <tr>
              <th scope="col" className="fill-width">Player</th>
              <th scope="col">Team&nbsp;1</th>
              <th scope="col">Team&nbsp;2</th>
              <th scope="col">No&nbsp;Team</th>
            </tr>
          </thead>
          <tbody>
            {
              members.map((member, index) => (
                <tr key={index}>
                  <td className="fill-width">{member.name}</td>
                  <td>
                    <Form.Check type={'radio'}
                      id={`rbTeam1${index}`}
                      value={Team.Team1}
                      checked={member.team === Team.Team1}
                      onChange={() => setMemberTeam(index, Team.Team1)} />
                  </td>
                  <td>
                    <Form.Check type={'radio'}
                      id={`rbTeam2${index}`}
                      value={Team.Team2}
                      checked={member.team === Team.Team2}
                      onChange={() => setMemberTeam(index, Team.Team2)} />
                  </td>
                  <td>
                    <Form.Check type={'radio'}
                      id={`rbNoTeam${index}`}
                      value={Team.None}
                      checked={member.team === Team.None}
                      onChange={() => setMemberTeam(index, Team.None)} />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </Row>
      <Row className="mt-3">
        <Button onClick={() => sendMembersToChannels()}>Apply Teams</Button>
      </Row>
      <Row className="mt-1">
        <Col className="p-0 pe-1">
          <Button className="w-100 mr-1" onClick={() => sendMembersToTeam1Channel()}>All To Team 1 Channel</Button>
        </Col>
        <Col className="p-0 ps-1">
          <Button className="w-100" onClick={() => sendMembersToTeam2Channel()}>All To Team 2 Channel</Button>
        </Col>
      </Row>
    </Form>
  );
}

export default SwapConfigurator;
