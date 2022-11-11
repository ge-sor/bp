import { Types } from 'mongoose';
import { AccessTypeEnum, NodeTypeEnum } from '../enum';

type NodeId = Types.ObjectId;
type SubjectId = Types.ObjectId;
type ObjectId = Types.ObjectId;
type ProjectId = Types.ObjectId;
type ActionId = Types.ObjectId;
type UserId = Types.ObjectId;
type PageId = Types.ObjectId;
type JobTitleId = Types.ObjectId;
type ConnectionId = Types.ObjectId;

export interface ICoordinates {
  x: number,
  y: number,
}

export interface IProjectAccess {
  projectId: ProjectId,
  accessType: AccessTypeEnum
}

export interface IJobTitle {
  _id: JobTitleId,
  name: string
}

export interface IUser {
  _id: UserId,
  username: string
  job_title: IJobTitle
  access: IProjectAccess[]
}

export interface ICreator {
  _id: UserId,
  username: string
}

export interface IProjectCreate {
  name: string
  description: string,
}

export interface IProject extends IProjectCreate {
  _id: ProjectId,
  creator: UserId
}

export interface IPageCreate {
  project_id: ProjectId,
  name: string
  description: string | null,
  nodes: INode[]

}
export interface IPage extends IPageCreate {
  _id: PageId,
  creator: UserId
}

export interface ISubject {
  _id: SubjectId,
  project_id: ProjectId,
  name: string
  description: string | null
  icon: string | null
  creator: UserId,
}

export interface IObject {
  _id: ObjectId,
  project_id: ProjectId,
  name: string
  description: string | null
  icon: string | null
  creator: UserId,
}

export interface IConnectionCreate {
  from: NodeId
  to: NodeId
  creator: UserId
}
export interface INodeSocketCreate {
  page_id: PageId,
  type: NodeTypeEnum,
  coordinates: ICoordinates,
  creator: UserId
}

export interface IConnection extends IConnectionCreate {
  _id: ConnectionId,
  creator: UserId
}

export interface IActionCreate {
  _id: ActionId,
  project_id: ProjectId,
  name: string
  description: string | null
  icon: string | null
}

export interface IAction extends IActionCreate {
  _id: ActionId,
  creator: UserId
}

export interface IObjectCreateProps {
  object: IActionCreate
  userId: string
}
export interface ISubjectCreateProps {
  subject: IActionCreate
  userId: string
}

export interface IProjectCreateProps {
  project: IProjectCreate
  userId: string
}

export interface IPageCreateProps {
  page: IPageCreate
  userId: string
}

export interface IConnectionCreateProps {
  connection: IConnectionCreate
  userId: string
}

export interface IActionCreateProps {
  action: IActionCreate
  userId: string
}

export interface INodeCreateProps {
  node: INodeCreate
  userId: string
}

export interface INodeCreate {
  page_id: PageId,
  title: string | null,
  subtitle: string | null,
  type: NodeTypeEnum,
  coordinates: ICoordinates,
  subject: ISubject | null,
  object: IObject | null,
  action: IAction | null,
  external_link: IExternalLink | null,
}

export interface IExternalLink {
  title: string,
  link: string
}
export interface INode extends INodeCreate {
  _id: NodeId,
  creator: UserId
}

export interface INodeMove {
  _id: NodeId,
  coordinates: ICoordinates,
}
