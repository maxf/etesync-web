import * as React from 'react';

import { List, ListItem } from '../widgets/List';

import { Theme, withTheme } from '@material-ui/core/styles';

import AppBarOverride from '../widgets/AppBarOverride';
import Container from '../widgets/Container';
import LoadingIndicator from '../widgets/LoadingIndicator';

import * as EteSync from '../api/EteSync';
import { CredentialsData } from '../store';

interface PropsType {
  etesync: CredentialsData;
  info: EteSync.CollectionInfo;
}

interface PropsTypeInner extends PropsType {
  theme: Theme;
}

class JournalMembers extends React.PureComponent<PropsTypeInner> {
  public state = {
    members: null as EteSync.JournalMemberJson[] | null,
  };

  constructor(props: PropsTypeInner) {
    super(props);
  }

  public render() {
    const { info } = this.props;
    const { members } = this.state;

    return (
      <>
        <AppBarOverride title={`${info.displayName} - Members`} />
        <Container style={{maxWidth: '30rem'}}>
          { members ?
              (members.length > 0 ?
                <List>
                  { members.map((member) => (
                    <ListItem key={member.user} onClick={undefined}>
                      {member.user}
                    </ListItem>
                  ))}
              </List>
              :
              <div>No members</div>
              )
            :
            <LoadingIndicator />
          }
        </Container>
      </>
    );
  }

  public componentDidMount() {
    this.fetchMembers();
  }

  private fetchMembers() {
    const { etesync, info } = this.props;

    const creds = etesync.credentials;
    const apiBase = etesync.serviceApiUrl;
    const journalMembersManager = new EteSync.JournalMembersManager(creds, apiBase, info.uid);
    journalMembersManager.list().then((members) => {
      this.setState({
        members,
      });
    });
  }
}

export default withTheme()(JournalMembers);
